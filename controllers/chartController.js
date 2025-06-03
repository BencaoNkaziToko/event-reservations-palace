import mysql from 'mysql2/promise';

// Configuração do banco de dados
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbeventos"
});

export async function getChartData(req, res) {
    try {
        console.log('Iniciando getChartData');

        // 1. Status das Reservas
        const [statusResult] = await pool.query(`
            SELECT 
                SUM(CASE WHEN status = 'pendente' THEN 1 ELSE 0 END) as pendentes,
                SUM(CASE WHEN status = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
                SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas
            FROM evento
        `);
        console.log('Status Result:', statusResult[0]);

        // 2. Reservas por Período (últimos 30 dias)
        const [reservasResult] = await pool.query(`
            SELECT 
                DATE(dataRealizacao) as data,
                COUNT(*) as total
            FROM evento
            WHERE dataRealizacao >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(dataRealizacao)
            ORDER BY data
        `);
        console.log('Reservas Result:', reservasResult);

        // 3. Receita por Período
        const [receitaResult] = await pool.query(`
            SELECT 
                DATE(e.dataRealizacao) as data,
                SUM(p.preco) as total
            FROM evento e
            JOIN pacote p ON e.idPacote = p.ID
            WHERE e.dataRealizacao >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(e.dataRealizacao)
            ORDER BY data
        `);
        console.log('Receita Result:', receitaResult);

        // 4. Pacotes Mais Populares
        const [pacotesResult] = await pool.query(`
            SELECT 
                p.nome,
                COUNT(e.ID) as total
            FROM evento e
            JOIN pacote p ON e.idPacote = p.ID
            GROUP BY p.ID, p.nome
            ORDER BY total DESC
            LIMIT 5
        `);
        console.log('Pacotes Result:', pacotesResult);

        // 5. Horários Populares
        const [horariosResult] = await pool.query(`
            SELECT 
                horario,
                COUNT(*) as total
            FROM evento
            GROUP BY horario
            ORDER BY total DESC
            LIMIT 5
        `);
        console.log('Horarios Result:', horariosResult);

        // 6. Receita por Pacote
        const [receitaPacotesResult] = await pool.query(`
            SELECT 
                p.nome,
                COALESCE(SUM(p.preco), 0) as total
            FROM evento e
            JOIN pacote p ON e.idPacote = p.ID
            WHERE e.status = 'confirmada'
            GROUP BY p.ID, p.nome
            ORDER BY total DESC
            LIMIT 5
        `);
        console.log('Receita por Pacote Result:', receitaPacotesResult);

        // 7. Média de Valor por Reserva
        const [mediaValorResult] = await pool.query(`
            SELECT 
                DATE(e.dataRealizacao) as data,
                COALESCE(AVG(p.preco), 0) as media
            FROM evento e
            JOIN pacote p ON e.idPacote = p.ID
            WHERE e.dataRealizacao >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(e.dataRealizacao)
            ORDER BY data
        `);
        console.log('Média de Valor Result:', mediaValorResult);

        // 8. Distribuição de Horários
        const [distribuicaoHorariosResult] = await pool.query(`
            SELECT 
                CASE 
                    WHEN SUBSTRING_INDEX(horario, ':', 1) BETWEEN 6 AND 11 THEN 'Manhã'
                    WHEN SUBSTRING_INDEX(horario, ':', 1) BETWEEN 12 AND 17 THEN 'Tarde'
                    ELSE 'Noite'
                END as periodo,
                COUNT(*) as total
            FROM evento
            GROUP BY periodo
            ORDER BY 
                CASE periodo
                    WHEN 'Manhã' THEN 1
                    WHEN 'Tarde' THEN 2
                    ELSE 3
                END
        `);
        console.log('Distribuição de Horários Result:', distribuicaoHorariosResult);

        // Preparar resposta
        const response = {
            reservasStatus: {
                pendentes: statusResult[0]?.pendentes || 0,
                confirmadas: statusResult[0]?.confirmadas || 0,
                canceladas: statusResult[0]?.canceladas || 0
            },
            reservasPeriodo: {
                labels: reservasResult.map(r => r.data.toISOString().split('T')[0]),
                valores: reservasResult.map(r => r.total)
            },
            receita: {
                labels: receitaResult.map(r => r.data.toISOString().split('T')[0]),
                valores: receitaResult.map(r => r.total || 0)
            },
            pacotesPopulares: {
                labels: pacotesResult.map(p => p.nome),
                valores: pacotesResult.map(p => p.total)
            },
            horariosPopulares: {
                labels: horariosResult.map(h => h.horario),
                valores: horariosResult.map(h => h.total)
            },
            receitaPacotes: {
                labels: receitaPacotesResult.map(p => p.nome),
                valores: receitaPacotesResult.map(p => p.total)
            },
            mediaValor: {
                labels: mediaValorResult.map(m => m.data.toISOString().split('T')[0]),
                valores: mediaValorResult.map(m => m.media)
            },
            distribuicaoHorarios: {
                labels: distribuicaoHorariosResult.map(d => d.periodo),
                valores: distribuicaoHorariosResult.map(d => d.total)
            }
        };

        console.log('Resposta final:', response);
        res.json(response);

    } catch (error) {
        console.error('Erro ao gerar dados dos gráficos:', error);
        res.status(500).json({ 
            error: 'Erro ao gerar dados dos gráficos',
            details: error.message 
        });
    }
} 