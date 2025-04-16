import express from 'express';
const router = express.Router();

import * as pacoteController from '../controllers/pacoteController.js';

// Rota para criar um pacote
router.post('/pacote', pacoteController.createPacote);

// Rota para listar todos os pacotes
router.get('/pacotes', pacoteController.getAllPacotes);

// Rota para buscar um pacote por ID
router.get('/pacote/:id', pacoteController.getPacoteById);

// Rota para atualizar um pacote
router.put('/pacote/:id', pacoteController.updatePacote);

// Rota para deletar um pacote
router.delete('/pacote/:id', pacoteController.deletePacote);

export default router;
