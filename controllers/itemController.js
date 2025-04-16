// controllers/itemController.js
import connection from '../Database/database.js';

export const createItem = async (req, res) => {
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
};

export const getAllItems = async (req, res) => {
  const sql = "SELECT * FROM item";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar itens", details: err });
    }
    res.json(results);
  });
};

export const getItemById = async (req, res) => {
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
};

export const updateItem = async (req, res) => {
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
};

export const deleteItem = async (req, res) => {
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
};
