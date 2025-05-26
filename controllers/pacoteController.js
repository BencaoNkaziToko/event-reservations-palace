import mysql from 'mysql2';
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbeventos",
});
// Create a new package    
export const createPacote = async (req, res) => {
  const { nome, descricao, preco } = req.body;
  console.log(req.body);

  // Corrigindo a query: garantindo que há 3 placeholders para 3 colunas
  const sql = "INSERT INTO pacote (nome, descricao, preco) VALUES (?, ?, ?)";

  connection.query(sql, [nome, descricao, preco], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao criar pacote", details: err });
    }
    res.status(201).json({ message: "Pacote criado com sucesso!", id: result.insertId });
  });
};

// List all packages
export const getAllPacotes = async (req, res) => {
  const sql = "SELECT * FROM pacote";
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar pacotes", details: err });
    }
    res.json(results);
  });
};

// Get a package by ID
export const getPacoteById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM pacote WHERE ID = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar pacote", details: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Pacote não encontrado" });
    }
    res.json(result[0]);
  });
};

// Update a package
export const updatePacote = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;

  // Atenção: a verificação condicional deve checar cada campo individualmente
  if (!nome || !descricao || !preco) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const sql = "UPDATE pacote SET nome = ?, descricao = ?, preco = ? WHERE ID = ?";
  connection.query(sql, [nome, descricao, preco, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar pacote", details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pacote não encontrado" });
    }
    res.json({ message: "Pacote atualizado com sucesso!" });
  });
};

// Delete a package
export const deletePacote = async (req, res) => {
  const { id } = req.params;

  // Verifica se o ID foi fornecido
  if (!id) {
    return res.status(400).json({ error: "ID do pacote é obrigatório" });
  }

  // Verifica se a conexão ainda está ativa
  if (!connection || connection.state === 'disconnected') {
    return res.status(500).json({ error: "Erro na conexão com o banco de dados" });
  }

  const sql = "DELETE FROM pacote WHERE ID = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      // Verifica se o erro é relacionado a chave estrangeira
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({
          error: "Não é possível deletar este pacote porque está associado a outros registros.",
          details: err
        });
      }
      return res.status(500).json({ error: "Erro ao deletar pacote", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pacote não encontrado" });
    }

    res.json({ message: "Pacote deletado com sucesso!" });
  });
};
