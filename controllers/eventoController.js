import mysql from 'mysql2';
import nodemailer from 'nodemailer';
import dotenv from'dotenv';
dotenv.config();

const connection = mysql.createConnection({
    host: "bkq9ne3sbfgmp2xka7hw-mysql.services.clever-cloud.com",
    user: "umuikl0mx6dacnou",
    password: "Zro2DPE0eqV2CJ4UQAVE",
    database: "bkq9ne3sbfgmp2xka7hw",
});

const remetente = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "bartolomew.sebas@gmail.com",
        pass: "iublprgrjwahubtn" 
    },
    tls:{
        rejectUnauthorized: false
    }
})

// aqui vai o codigo do envio de email


// Função para criar o evento
export const createEvento = async (req, res) => {
  try {
    const { descricao, dataRealizacao, horario, solicitante, dataSolicitacao, telefone, email, status, idPacote } = req.body;
    console.log(req.body);

    // Verificação dos campos obrigatórios
    if (!descricao || !dataRealizacao || !solicitante || !dataSolicitacao || !telefone || !status) {
      return res.status(400).json({ error: "Campos obrigatórios estão faltando." });
    }

    // Tratamento do campo idPacote: transforma string vazia ou nula em null
    const pacoteValue = idPacote && idPacote.trim() !== '' ? idPacote : null;

    const sql = `INSERT INTO evento 
      (descricao, dataRealizacao, horario, solicitante, dataSolicitacao, telefone, email, status, idPacote) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(sql, [descricao, dataRealizacao, horario || null, solicitante, dataSolicitacao, telefone, email || null, status, pacoteValue], async (err, result) => {
      if (err) {
        console.error("Erro ao criar evento:", err);
        return res.status(500).json({ error: "Erro ao criar evento", details: err });
      }
      
      res.json({ success: true, message: "Evento criado com sucesso!", id: result.insertId });
        const mailOptions = {
            from: `Palacio das Estrelas <bartolomew.sebas@gmail.com>`,
            to: email,
            subject: "Notificação",
            html: `<strong>Sr(a). ${solicitante}, o evento ${descricao} cadastrado com sucesso. Por favor, dirija-se ao nosso estabelecimento para confirmar a sua reserva.</strong>`
        }
        remetente.sendMail(mailOptions, (erro, info) => {
            if(erro){
                console.log(erro)
            }else{
                console.log(info)
            }
        })

    });
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};


// Listar todos os eventos
export const getAllEventos = async (req, res) => {
    const sql = "SELECT * FROM evento LEFT JOIN pacote ON evento.idPacote = pacote.id";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar eventos", details: err });
        }
        res.json(results);
    });
};

// Buscar um evento pelo ID
export const getEventoById = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM evento WHERE ID = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar evento", details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }
        res.json(result[0]);
    });
};

// Atualizar evento
export const updateEvento = async (req, res) => {
    const { id } = req.params;
    const { descricao, dataRealizacao, horario, solicitante, dataSolicitacao, telefone, email, status, idPacote } = req.body;

    if (!descricao || !dataRealizacao || !solicitante || !dataSolicitacao || !telefone || !status) {
        return res.status(400).json({ error: "Descrição, data de realização, solicitante, data de solicitação, telefone e status são obrigatórios" });
    }

    const sql = "UPDATE evento SET descricao = ?, dataRealizacao = ?, horario = ?, solicitante = ?, dataSolicitacao = ?, telefone = ?, email = ?, status = ?, idPacote = ? WHERE ID = ?";
    connection.query(sql, [descricao, dataRealizacao, horario, solicitante, dataSolicitacao, telefone, email, status, idPacote, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao atualizar evento", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }
        res.json({ message: "Evento atualizado com sucesso!" });
    });
};

// Deletar evento
export const deleteEvento = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM evento WHERE ID = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao deletar evento", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }
        res.json({ message: "Evento deletado com sucesso!" });
    });
};

// Pacotes mais solicitados
export const getPacotesMaisSolicitados = async (req, res) => {
    const sql = `
        SELECT p.descricao, COUNT(e.idPacote) AS quantidade
        FROM evento e
        JOIN pacote p ON e.idPacote = p.ID
        GROUP BY e.idPacote
        ORDER BY quantidade DESC
        LIMIT 5
    `;
    
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar pacotes mais solicitados", details: err });
        }
        res.json(results);
    });
};

// Pacotes menos solicitados
export const getPacotesMenosSolicitados = async (req, res) => {
    const sql = `
        SELECT p.descricao, COUNT(e.idPacote) AS quantidade
        FROM evento e
        JOIN pacote p ON e.idPacote = p.ID
        GROUP BY e.idPacote
        ORDER BY quantidade ASC
        LIMIT 5
    `;
    
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar pacotes menos solicitados", details: err });
        }
        res.json(results);
    });
};

// Horários mais solicitados
export const getHorariosMaisSolicitados = async (req, res) => {
    const sql = `
        SELECT horario, COUNT(*) AS quantidade
        FROM evento
        GROUP BY horario
        ORDER BY quantidade DESC
        LIMIT 5
    `;
    
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar horários mais solicitados", details: err });
        }
        res.json(results);
    });
};

// Horários menos solicitados
export const getHorariosMenosSolicitados = async (req, res) => {
    const sql = `
        SELECT horario, COUNT(*) AS quantidade
        FROM evento
        GROUP BY horario
        ORDER BY quantidade ASC
        LIMIT 5
    `;
    
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar horários menos solicitados", details: err });
        }
        res.json(results);
    });
};

// Obter total arrecadado por mês e ano
export const getTotalArrecadadoPorMesEAno = async (req, res) => {
    const { ano } = req.params;  // Ano como parâmetro da requisição

    const sql = `
        SELECT 
            YEAR(e.dataRealizacao) AS ano,
            MONTH(e.dataRealizacao) AS mes,
            SUM(p.preco) AS totalArrecadado
        FROM 
            evento e
        JOIN 
            pacote p ON e.idPacote = p.ID
        WHERE 
            YEAR(e.dataRealizacao) = ?
        GROUP BY 
            YEAR(e.dataRealizacao), MONTH(e.dataRealizacao)
        ORDER BY 
            ano DESC, mes DESC
    `;

    connection.query(sql, [ano], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao calcular o total arrecadado", details: err });
        }

        // Caso não haja eventos para o ano especificado
        if (results.length === 0) {
            return res.status(404).json({ message: "Nenhum evento encontrado para o ano especificado" });
        }

        res.json(results);
    });
};



// Obter total arrecadado de um ano específico
export const getTotalArrecadadoPorAno = async (req, res) => {
    const { ano } = req.params;  // Ano como parâmetro da requisição

    const sql = `
        SELECT 
            YEAR(e.dataRealizacao) AS ano,
            SUM(p.preco) AS totalArrecadado
        FROM 
            evento e
        JOIN 
            pacote p ON e.idPacote = p.ID
        WHERE 
            YEAR(e.dataRealizacao) = ?
        GROUP BY 
            YEAR(e.dataRealizacao)
        ORDER BY 
            ano DESC;
    `;

    connection.query(sql, [ano], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao calcular o total arrecadado", details: err });
        }

        // Caso não haja eventos para o ano especificado
        if (results.length === 0) {
            return res.status(404).json({ message: "Nenhum evento encontrado para o ano especificado" });
        }

        res.json(results[0]);  // Como só esperamos um único ano, retornamos o primeiro resultado
    });
};

  

