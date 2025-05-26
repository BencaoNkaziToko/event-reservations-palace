import express from 'express';
import { getChartData } from '../controllers/chartController.js';

const router = express.Router();

// Rota para a página de gráficos
router.get('/admin-charts', (req, res) => {
    res.render('admin-charts');
});

// Rota para obter dados dos gráficos
router.get('/api/charts', getChartData);

export default router; 