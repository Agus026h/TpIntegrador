const express = require('express');
const router = express.Router();
const admisionController = require('../controllers/admisionController');
const { validateAdmision } = require('../middlewares/validationMiddleware'); 


router.get('/nueva', admisionController.mostrarFormularioNuevaAdmision);


router.post('/buscar-paciente', admisionController.buscarPacientePorDNI);

router.get('/activas', admisionController.mostrarAdmisionesActivas);


router.post('/nueva', validateAdmision, admisionController.crearNuevaAdmision);
router.post('/:id/cancelar', admisionController.cancelarAdmision);
router.post('/:id/finalizar', admisionController.finalizarAdmision);

module.exports = router;