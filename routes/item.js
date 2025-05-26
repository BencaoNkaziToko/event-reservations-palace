import express from 'express';
import {
    createItem,
    getAllItens,
    getItemById,
    updateItem,
    deleteItem,
    getItensByTipo
} from '../controllers/itemController.js';

const router = express.Router();

// Rota para a página de administração de itens
router.get('/admin-items', getAllItens);

// Rotas da API
router.post('/itens', createItem);
router.get('/itens', getAllItens);
router.get('/itens/:id', getItemById);
router.put('/itens/:id', updateItem);
router.delete('/itens/:id', deleteItem);
router.get('/itens/tipo/:tipo', getItensByTipo);

export default router;
