const express = require('express');
const router = express.Router();
const utilizadorController = require('../controllers/utilizadorController');

// Rota para criar um utilizador
router.post('/utilizador', utilizadorController.createUtilizador);

// Rota para listar todos os utilizadores
router.get('/utilizadores', utilizadorController.getAllUtilizadores);

// Rota para buscar um utilizador por ID
router.get('/utilizador/:id', utilizadorController.getUtilizadorById);

// Rota para atualizar um utilizador
router.put('/utilizador/:id', utilizadorController.updateUtilizador);

// Rota para deletar um utilizador
router.delete('/utilizador/:id', utilizadorController.deleteUtilizador);

// Rota para login
router.post('/login', utilizadorController.login);

module.exports = router;
