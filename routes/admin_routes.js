const express = require('express')
const router = express.Router()
const admController = require('../controllers/admin_controller')




router.get('/admin', admController.dashboard)
router.get('/login', admController.login)


module.exports = router;

