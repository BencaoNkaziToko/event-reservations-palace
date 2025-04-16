// routes/public_routes.js
import express from 'express';
const router = express.Router();

import { homeController } from '../controllers/public_controller.js';

// Definição das rotas
router.get('/', homeController.home);
router.get('/menu', homeController.menu);

export default router;
