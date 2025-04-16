const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, 'secrettoken');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Token inválido" });
    }
};

module.exports = authMiddleware;
