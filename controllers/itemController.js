import mysql from 'mysql2';

// Conexão com o banco de dados
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbeventos",
});

// Criar um novo item no cardápio
export async function createItem(req, res) {
    const { nome, preco, tipo } = req.body;

    if (!nome || !preco || !tipo) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "INSERT INTO item (nome, preco, tipo) VALUES (?, ?, ?)";
    connection.query(sql, [nome, preco, tipo], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao criar item", details: err });
        }
        res.status(201).json({ message: "Item criado com sucesso!", id: result.insertId });
    });
}

// Listar todos os itens
export function getAllItens(req, res) {
    const itensQuery = "SELECT * FROM item";

    connection.query(itensQuery, (err, itens) => {
        if (err) {
            console.error("Erro ao buscar itens:", err);
            return res.status(500).json({ error: "Erro interno ao buscar itens." });
        }

        // Se a requisição espera JSON, retorna JSON
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json(itens);
        }

        // Caso contrário, renderiza a view
        res.render("admin-items", {
            itens: itens || []
        });
    });
}

// Buscar item pelo ID
export async function getItemById(req, res) {
    const { id } = req.params;
    const sql = "SELECT * FROM item WHERE ID = ?";
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar item", details: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Item não encontrado" });
        }
        res.json(result[0]);
    });
}

// Atualizar um item
export async function updateItem(req, res) {
    const { id } = req.params;
    const { nome, preco, tipo } = req.body;

    if (!nome || !preco || !tipo) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const sql = "UPDATE item SET nome = ?, preco = ?, tipo = ? WHERE ID = ?";
    connection.query(sql, [nome, preco, tipo, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao atualizar item", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item não encontrado" });
        }
        res.json({ message: "Item atualizado com sucesso!" });
    });
}

// Deletar item
export async function deleteItem(req, res) {
    const { id } = req.params;
    const sql = "DELETE FROM item WHERE ID = ?";
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao deletar item", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item não encontrado" });
        }
        res.json({ message: "Item deletado com sucesso!" });
    });
}

// Consultar itens por tipo
export async function getItensByTipo(req, res) {
    const { tipo } = req.params;

    const allowedTypes = ['Nacional', 'Internacional', 'Outro'];
    if (!allowedTypes.includes(tipo)) {
        return res.status(400).json({ error: "Tipo inválido. Deve ser Nacional, Internacional ou Outro." });
    }

    const sql = "SELECT * FROM item WHERE tipo = ?";
    connection.query(sql, [tipo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar itens por tipo", details: err });
        }
        res.json(results);
    });
}
