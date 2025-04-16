const express = require('express');
const router = express.Router();
const funcaoController = require('../controllers/funcaoController');

// Rota para criar uma função
router.post('/funcao', funcaoController.createFuncao);

// Rota para listar todas as funções
router.get('/funcoes', funcaoController.getAllFuncoes);

// Rota para buscar uma função por ID
router.get('/funcao/:id', funcaoController.getFuncaoById);

// Rota para atualizar uma função
router.put('/funcao/:id', funcaoController.updateFuncao);

// Rota para deletar uma função
router.delete('/funcao/:id', funcaoController.deleteFuncao);

module.exports = router;
