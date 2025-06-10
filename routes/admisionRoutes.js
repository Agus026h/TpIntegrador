const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');
const { validateAdmision } = require('../middlewares/validationMiddleware'); 


router.get('/nueva', admisionController.mostrarFormularioNuevaAdmision);


router.post('/buscar-paciente', admisionController.buscarPacientePorDNI);


router.post('/nueva', validateAdmision, admisionController.crearNuevaAdmision);

module.exports = router;