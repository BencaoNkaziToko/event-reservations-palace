const connection = require('../Database/database');

// Criar uma nova função
exports.createFuncao = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO funcao (nome, descricao) VALUES (?, ?)";
    connection.query(sql, [nome, descricao], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao criar função", details: err });
        }
        res.status(201).json({ message: "Função criada com sucesso!", id: result.insertId });
    });
};

// Listar todas as funções
exports.getAllFuncoes = async (req, res) => {
    const sql = "SELECT * FROM funcao";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar funções", details: err });
        }
        res.json(results);
    });
};

// Buscar uma função pelo ID
exports.getFuncaoById = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM funcao WHERE ID = ?";
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar função", details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Função não encontrada" });
        }
        res.json(result[0]);
    });
};

// Atualizar uma função
exports.updateFuncao = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "UPDATE funcao SET nome = ?, descricao = ? WHERE ID = ?";
    connection.query(sql, [nome, descricao, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao atualizar função", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Função não encontrada" });
        }
        res.json({ message: "Função atualizada com sucesso!" });
    });
};

// Deletar uma função
exports.deleteFuncao = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM funcao WHERE ID = ?";
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao deletar função", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Função não encontrada" });
        }
        res.json({ message: "Função deletada com sucesso!" });
    });
};
