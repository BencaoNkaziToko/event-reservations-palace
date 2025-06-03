import express from 'express'
import { dashboard, reservations, items, charts, login } from '../controllers/admin_controller.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

// Rota de login (página)
router.get('/login', login)

// Rotas protegidas
router.get('/admin', isAuthenticated, dashboard)
router.get('/admin-reservations', isAuthenticated, reservations)
router.get('/admin-items', isAuthenticated, items)
router.get('/admin-charts', isAuthenticated, charts)

export default router;

