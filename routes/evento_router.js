// src/routes/eventoRoutes.js
const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');


// Criar evento
router.post('/eventos', eventoController.createEvento);
router.post('/admin-eventos', eventoController.adminCreateEvento)
// Listar todos os eventos
router.get('/eventos', eventoController.getAllEventos);

// Buscar evento por ID
router.get('/eventos/:id', eventoController.getEventoById);

// Atualizar evento
router.put('/eventos/:id', eventoController.updateEvento);

// Deletar evento
router.delete('/eventos/:id', eventoController.deleteEvento);

// Estatísticas de pacotes
router.get('/eventos/pacotes/mais-solicitados', eventoController.getPacotesMaisSolicitados);
router.get('/eventos/pacotes/menos-solicitados', eventoController.getPacotesMenosSolicitados);

// Estatísticas de horários
router.get('/eventos/horarios/mais-solicitados', eventoController.getHorariosMaisSolicitados);
router.get('/eventos/horarios/menos-solicitados', eventoController.getHorariosMenosSolicitados);


router.get('/eventos/arrecadacao/:ano', eventoController.getTotalArrecadadoPorMesEAno);
router.get('/eventos/arrecadacao/ano/:ano', eventoController.getTotalArrecadadoPorAno);

// Listar todos os eventos em JSON para atualização dinâmica
router.get('/eventos-json', eventoController.getAllEventosJson);

module.exports = router;
