import express from 'express';
const router = express.Router();
import * as facture from '../controllers/factureController.js';

router.get('/admin-facture/:id', facture.printFacture);

export default router;
