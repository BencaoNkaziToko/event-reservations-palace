import mysql from 'mysql2';
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbeventos",
});


function pegarAnoAtual() {
    return new Date().getFullYear();
}

let anoAtual = pegarAnoAtual();
export const dashboard = async(req, res)=>{
    const eventosMes = `SELECT * FROM evento WHERE month(dataSolicitacao) = month(now()) and year(dataSolicitacao) = ${anoAtual}`;
    const eventosConfirmados = `SELECT * FROM evento WHERE status='confirmado' and year(dataSolicitacao) = ${anoAtual}`;
    const eventosPendentes = `SELECT * FROM evento WHERE status='Pendente' and year(dataSolicitacao) = ${anoAtual}`;
    const eventosCancelados = `SELECT * FROM evento WHERE status='Cancelado' and year(dataSolicitacao) = ${anoAtual}`;
    const eventosGerais = `SELECT * FROM evento`
    const eventoMesTotal = "SELECT COALESCE(SUM(p.preco), 0) AS total_arrecadado FROM evento e JOIN pacote p ON e.idPacote = p.ID WHERE e.status = 'confirmado' AND MONTH(e.dataSolicitacao) = MONTH(CURRENT_DATE()) AND YEAR(e.dataSolicitacao) = YEAR(CURRENT_DATE());"
    const eventoAnualTotal = "SELECT SUM(p.preco) AS total_arrecadado FROM evento e JOIN pacote p ON e.idPacote = p.ID WHERE e.status = 'confirmado' AND YEAR(e.dataSolicitacao) = YEAR(CURDATE());"
    const eventosRecentes = "SELECT * FROM evento inner join pacote on evento.idPacote = pacote.ID WHERE status = 'pendente' ORDER BY dataSolicitacao DESC;"
    //const eventoConfirmadoMes = "SELECT * FROM evento INNER JOIN pacote ON evento.idPacote = pacote.ID WHERE status = 'confirmado' AND YEAR(dataSolicitacao) = YEAR(CURDATE()) AND MONTH(dataSolicitacao) = MONTH(CURDATE()) ORDER BY dataSolicitacao DESC;"
    const eventoConfirmadoMes = "SELECT evento.descricao as event, evento.dataRealizacao,evento.horario, evento.solicitante, pacote.preco,pacote.descricao as descpac, pacote.nome as nomepac FROM evento INNER JOIN pacote ON evento.idPacote = pacote.ID WHERE status = 'confirmado' AND YEAR(dataSolicitacao) = YEAR(CURDATE()) AND MONTH(dataSolicitacao) = MONTH(CURDATE()) ORDER BY dataSolicitacao DESC;"
    connection.query(eventosConfirmados, (err, confirmados) => {
        connection.query(eventosPendentes, (err, pendentes) => {
            connection.query(eventosCancelados, (err, cancelados) => {
                connection.query(eventosGerais, (err, gerais) => {
                    connection.query(eventosMes, (err, mes) => {
                        connection.query(eventoConfirmadoMes, (err, confirmadosMes) => {
                            connection.query(eventosRecentes, (err, recentes) => { 
                                connection.query(eventoMesTotal, (err, results) => {
                                    // Capturar o total arrecadado
                                    const totalArrecadadoMensal = results?.[0]?.total_arrecadado || 0;
                                    // Formatar para exibição
                                    const totalFormatadoMensal = new Intl.NumberFormat('en-US').format(totalArrecadadoMensal);

                                    connection.query(eventoAnualTotal, (err, results) => {
                                        // Capturar o total arrecadado  anual    
                                        const totalArrecadadoAnual = results?.[0]?.total_arrecadado || 0;

                                        // Formatar para exibição
                                        const totalFormatadoAnual = new Intl.NumberFormat('en-US').format(totalArrecadadoAnual);

                                        // Renderizar a página com os dados
                                        res.render("admin-home", {
                                            title: "Dashboard",
                                            confirmados,
                                            pendentes,
                                            cancelados,
                                            gerais,
                                            mes,
                                            totalFormatadoMensal,
                                            totalFormatadoAnual,
                                            recentes,
                                            confirmadosMes
                                            
                                        })
                                    })
                                })
                            })
                        })        
                    })
                });
            });
        })
    });
}


//login
export const login = (req, res) => {
    res.render("login", {
        title: "Login"
    });
}