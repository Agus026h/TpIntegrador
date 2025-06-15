const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { validatePaciente } = require('../middlewares/validationMiddleware'); 


// Ruta principal para ver todos los pacientes activos
router.get('/', pacienteController.listarPacientes);


// Rutas para Nuevo Paciente
router.get('/nuevo', pacienteController.mostrarFormularioNuevoPaciente);
router.post('/nuevo', validatePaciente, pacienteController.crearNuevoPaciente);


// Rutas para Modificar Paciente
router.get('/modificar', pacienteController.mostrarFormularioBuscarPacienteModificar);
router.post('/modificar/buscar', pacienteController.buscarPacienteParaModificar);
router.get('/modificar/:id', pacienteController.mostrarFormularioModificarPaciente);
router.post('/modificar/:id', validatePaciente, pacienteController.modificarPaciente);


// Rutas de Detalle y Eliminación
router.get('/detalle/:id', pacienteController.getPacienteById); 
router.post('/eliminar/:id', pacienteController.desactivarPaciente); 

module.exports = router;
