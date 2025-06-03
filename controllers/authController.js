import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbeventos",
});

// Função para registrar um novo usuário
export const register = async (req, res) => {
    const { nomeUtilizador, nome, senha } = req.body;

    try {
        // Verificar se o usuário já existe
        const checkUser = "SELECT * FROM utilizador WHERE nomeUtilizador = ?";
        connection.query(checkUser, [nomeUtilizador], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao verificar usuário" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "Nome de usuário já existe" });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Inserir novo usuário
            const sql = "INSERT INTO utilizador (nomeUtilizador, nome, senha) VALUES (?, ?, ?)";
            connection.query(sql, [nomeUtilizador, nome, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Erro ao registrar usuário" });
                }
                res.status(201).json({ message: "Usuário registrado com sucesso" });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Função para autenticar usuário
export const login = async (req, res) => {
    const { nomeUtilizador, senha } = req.body;

    try {
        const sql = "SELECT * FROM utilizador WHERE nomeUtilizador = ?";
        connection.query(sql, [nomeUtilizador], async (err, results) => {
            if (err) {
                console.error('Erro ao buscar usuário:', err);
                return res.status(500).json({ error: "Erro ao buscar usuário" });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Usuário não encontrado" });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(senha, user.senha);

            if (!validPassword) {
                return res.status(401).json({ error: "Senha incorreta" });
            }

            // Criar sessão
            req.session.user = {
                id: user.ID,
                nomeUtilizador: user.nomeUtilizador,
                nome: user.nome
            };

            // Salvar sessão
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.status(500).json({ error: "Erro ao criar sessão" });
                }
                res.json({ success: true, message: "Login realizado com sucesso" });
            });
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Função para fazer logout
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).json({ error: "Erro ao fazer logout" });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logout realizado com sucesso" });
    });
}; 