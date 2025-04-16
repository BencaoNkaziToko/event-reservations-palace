// routes/item.js
import express from 'express';
const router = express.Router();

import * as itemController from '../controllers/itemController.js';

// Criar um novo item (POST)
router.post('/items', itemController.createItem);

// Listar todos os itens (GET)
router.get('/items', itemController.getAllItems);

// Buscar um item pelo ID (GET)
router.get('/items/:id', itemController.getItemById);

// Atualizar um item (PUT)
router.put('/items/:id', itemController.updateItem);

// Deletar um item (DELETE)
router.delete('/items/:id', itemController.deleteItem);

export default router;
