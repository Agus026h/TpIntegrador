const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController'); 
const { validatePaciente } = require('../middlewares/validationMiddleware');


router.get('/nuevo', pacienteController.mostrarFormularioNuevoPaciente);
router.post('/nuevo', validatePaciente, pacienteController.crearNuevoPaciente);


router.get('/modificar', pacienteController.mostrarFormularioBuscarPacienteModificar);


router.post('/modificar/buscar', pacienteController.buscarPacienteParaModificar);


router.get('/modificar/:id', pacienteController.mostrarFormularioModificarPaciente);


router.post('/modificar/:id', validatePaciente, pacienteController.modificarPaciente);

module.exports = router;
