import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { isNotAuthenticated, isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Rota de login
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' });
});

// Rota de autenticação
router.post('/login', isNotAuthenticated, login);

// Rota de logout
router.post('/logout', logout);

// Rotas protegidas
router.get('/admin', isAuthenticated, (req, res) => {
    res.render('admin-home', { 
        title: 'Dashboard',
        user: req.session.user
    });
});

router.get('/admin-charts', isAuthenticated, (req, res) => {
    res.render('admin-charts', { 
        title: 'Gráficos',
        user: req.session.user
    });
});

router.get('/admin-items', isAuthenticated, (req, res) => {
    res.render('admin-items', { 
        title: 'Itens',
        user: req.session.user
    });
});

export default router; 