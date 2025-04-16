import express from 'express';
const router = express.Router();
import * as facture from '../controllers/factureController.js';

router.get('/facture/:id', facture.printFacture);

export default router;
