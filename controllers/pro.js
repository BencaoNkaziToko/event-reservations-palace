import connection from '../Database/database.js';
import express from 'express';
import session from 'express-session';

// Configurar sessão
const app = express();
app.use(session({
    secret: "seuSegredoAqui",
    resave: false,
    saveUninitialized: true,
}));

// Middleware para verificar a sessão
const verificarSessao = (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
};

function pegarAnoAtual() {
    return new Date().getFullYear();
}

let anoAtual = pegarAnoAtual();
export const dashboard = async (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    
    const queries = {
        eventosMes: `SELECT * FROM evento WHERE month(dataSolicitacao) = month(now()) and year(dataSolicitacao) = ${anoAtual}`,
        eventosConfirmados: `SELECT * FROM evento WHERE status='confirmado' and year(dataSolicitacao) = ${anoAtual}`,
        eventosPendentes: `SELECT * FROM evento WHERE status='Pendente' and year(dataSolicitacao) = ${anoAtual}`,
        eventosCancelados: `SELECT * FROM evento WHERE status='Cancelado' and year(dataSolicitacao) = ${anoAtual}`,
        eventosGerais: `SELECT * FROM evento`,
        eventoMesTotal: "SELECT COALESCE(SUM(p.preco), 0) AS total_arrecadado FROM evento e JOIN pacote p ON e.idPacote = p.ID WHERE e.status = 'confirmado' AND MONTH(e.dataSolicitacao) = MONTH(CURRENT_DATE()) AND YEAR(e.dataSolicitacao) = YEAR(CURRENT_DATE());",
        eventoAnualTotal: "SELECT SUM(p.preco) AS total_arrecadado FROM evento e JOIN pacote p ON e.idPacote = p.ID WHERE e.status = 'confirmado' AND YEAR(e.dataSolicitacao) = YEAR(CURDATE());",
        eventosRecentes: "SELECT * FROM evento INNER JOIN pacote ON evento.idPacote = pacote.ID WHERE status = 'pendente' ORDER BY dataSolicitacao DESC;",
        eventoConfirmadoMes: "SELECT evento.descricao as event, evento.dataRealizacao, evento.horario, evento.solicitante, pacote.preco, pacote.descricao as descpac, pacote.nome as nomepac FROM evento INNER JOIN pacote ON evento.idPacote = pacote.ID WHERE status = 'confirmado' AND YEAR(dataSolicitacao) = YEAR(CURDATE()) AND MONTH(dataSolicitacao) = MONTH(CURDATE()) ORDER BY dataSolicitacao DESC;"
    };
    
    connection.query(queries.eventosConfirmados, (err, confirmados) => {
        connection.query(queries.eventosPendentes, (err, pendentes) => {
            connection.query(queries.eventosCancelados, (err, cancelados) => {
                connection.query(queries.eventosGerais, (err, gerais) => {
                    connection.query(queries.eventosMes, (err, mes) => {
                        connection.query(queries.eventoConfirmadoMes, (err, confirmadosMes) => {
                            connection.query(queries.eventosRecentes, (err, recentes) => {
                                connection.query(queries.eventoMesTotal, (err, results) => {
                                    const totalArrecadadoMensal = results?.[0]?.total_arrecadado || 0;
                                    const totalFormatadoMensal = new Intl.NumberFormat('en-US').format(totalArrecadadoMensal);

                                    connection.query(queries.eventoAnualTotal, (err, results) => {
                                        const totalArrecadadoAnual = results?.[0]?.total_arrecadado || 0;
                                        const totalFormatadoAnual = new Intl.NumberFormat('en-US').format(totalArrecadadoAnual);

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
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

// CRUD DE PACOTES
export const pacotes = [verificarSessao, (req, res) => {
    const sql = "SELECT * FROM pacote";
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render("admin-pacotes", { title: "Pacotes", pacotes: results });
    });
}];

export const adicionarPacotePost = [verificarSessao, (req, res) => {
    const { nome, descricao, preco } = req.body;
    const sql = `INSERT INTO pacote (nome, descricao, preco) VALUES (?, ?, ?)`;
    connection.query(sql, [nome, descricao, preco], (err, results) => {
        if (err) throw err;
        res.redirect("/admin/pacotes");
    });
}];

export const editarPacotePost = [verificarSessao, (req, res) => {
    const id = req.params.id;
    const { nome, descricao, preco } = req.body;
    const sql = `UPDATE pacote SET nome=?, descricao=?, preco=? WHERE ID=?`;
    connection.query(sql, [nome, descricao, preco, id], (err, results) => {
        if (err) throw err;
        res.redirect("/admin/pacotes");
    });
}];

export const deletarPacote = [verificarSessao, (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM pacote WHERE ID=?`;
    connection.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.redirect("/admin/pacotes");
    });
}];
