const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../Database/database');

// Criar um novo utilizador
exports.createUtilizador = async (req, res) => {
    const { nome, nomeUtilizador, senha } = req.body;

    if (!nome || !nomeUtilizador || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const sql = "INSERT INTO utilizador (nome, nomeUtilizador, senha) VALUES (?, ?, ?)";
    connection.query(sql, [nome, nomeUtilizador, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao criar utilizador", details: err });
        }
        res.status(201).json({ message: "Utilizador criado com sucesso!", id: result.insertId });
    });
};

// Listar todos os utilizadores
exports.getAllUtilizadores = async (req, res) => {
    const sql = "SELECT * FROM utilizador";
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar utilizadores", details: err });
        }
        res.json(results);
    });
};

// Buscar um utilizador pelo ID
exports.getUtilizadorById = async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM utilizador WHERE ID = ?";
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar utilizador", details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado" });
        }
        res.json(result[0]);
    });
};

// Atualizar um utilizador
exports.updateUtilizador = async (req, res) => {
    const { id } = req.params;
    const { nome, nomeUtilizador, senha } = req.body;

    if (!nome || !nomeUtilizador || !senha) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // Criptografar a nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const sql = "UPDATE utilizador SET nome = ?, nomeUtilizador = ?, senha = ? WHERE ID = ?";
    connection.query(sql, [nome, nomeUtilizador, hashedPassword, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao atualizar utilizador", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado" });
        }
        res.json({ message: "Utilizador atualizado com sucesso!" });
    });
};

// Deletar um utilizador
exports.deleteUtilizador = async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM utilizador WHERE ID = ?";
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao deletar utilizador", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado" });
        }
        res.json({ message: "Utilizador deletado com sucesso!" });
    });
};

// Login de um utilizador
exports.login = async (req, res) => {
    const { nomeUtilizador, senha } = req.body;

    if (!nomeUtilizador || !senha) {
        return res.status(400).json({ error: "Nome de utilizador e senha são obrigatórios" });
    }

    const sql = "SELECT * FROM utilizador WHERE nomeUtilizador = ?";
    connection.query(sql, [nomeUtilizador], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar utilizador", details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Nome de utilizador não encontrado" });
        }

        // Comparar a senha fornecida com a senha criptografada no banco de dados
        const isMatch = await bcrypt.compare(senha, result[0].senha);
        if (!isMatch) {
            return res.status(400).json({ message: "Senha incorreta" });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: result[0].ID, nomeUtilizador: result[0].nomeUtilizador },
            'secrettoken',  // Substitua por uma chave secreta de sua escolha
            { expiresIn: '1h' }  // Token expira em 1 hora
        );

        res.json({
            message: "Login bem-sucedido",
            token: token
        });
    });
};
