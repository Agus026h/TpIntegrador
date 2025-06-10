const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { validatePaciente } = require('../middlewares/validationMiddleware'); 


router.get('/nuevo', pacienteController.mostrarFormularioNuevoPaciente);


router.post('/nuevo', validatePaciente, pacienteController.crearNuevoPaciente);

module.exports = router;