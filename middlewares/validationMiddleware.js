const db = require('../config/db');
const camaUtils = require('../models/camaUtils'); 


async function renderAdmisionFormWithError(req, res, errorMessages, paciente = null, linkRegistroPaciente = null) {
    let pacienteRecuperado = paciente;
    if (!pacienteRecuperado && req.body.dni) {
        try {
            pacienteRecuperado = await db.Paciente.findOne({ where: { dni: req.body.dni } });
        } catch (err) {
            console.error('Error al intentar recuperar paciente para re-renderizar formulario (Admision):', err);
        }
    }

    let camasDisponibles = [];
    try {
        camasDisponibles = await camaUtils.getCamasDisponibles();
    } catch (err) {
        console.error('Error al cargar camas disponibles para re-renderizar el formulario (Admision):', err);
    }

    res.status(400).render('admision/nueva_admision', {
        titulo: 'Nueva Admisión de Paciente',
        error: errorMessages.join('<br>'),
        linkRegistroPaciente: linkRegistroPaciente,
        paciente: pacienteRecuperado,
        camasDisponibles: camasDisponibles,
        formData: req.body
    });
}


function renderPacienteFormWithError(req, res, errors, formType = 'nuevo_paciente', pacienteData = null) {
    const tituloMap = {
        'nuevo_paciente': 'Registrar Nuevo Paciente',
        'modificar_paciente': 'Editar Datos de Paciente'
    };
    const titulo = tituloMap[formType] || 'Error en Formulario';

    
    let paciente = pacienteData;
    if (formType === 'modificar_paciente' && !pacienteData && req.params.id) {
        
        db.Paciente.findByPk(req.params.id)
            .then(foundPaciente => {
                paciente = foundPaciente;
                res.status(400).render(`paciente/${formType}`, {
                    titulo: titulo,
                    error: errors.join('<br>'),
                    paciente: paciente, 
                    formData: req.body 
                });
            })
            .catch(err => {
                console.error('Error recuperando paciente para re-renderizar el formulario de modificación:', err);
              
                res.status(500).render('error', {
                    titulo: 'Error Interno',
                    error: 'Error al procesar los datos y cargar el formulario de edición.'
                });
            });
    } else {
        res.status(400).render(`paciente/${formType}`, {
            titulo: titulo,
            error: errors.join('<br>'),
            paciente: paciente, 
            formData: req.body 
        });
    }
}


// validatePaciente: Este middleware valida los campos comunes de un paciente
async function validatePaciente(req, res, next) {
    const { dni, nombre, apellido, fecha_nacimiento, sexo, email } = req.body;
    let errors = [];

    
    const isModifying = req.originalUrl.includes('/modificar/'); 
    const formView = isModifying ? 'modificar_paciente' : 'nuevo_paciente';

    if (!dni || dni.toString().length < 7 || isNaN(parseInt(dni))) { 
        errors.push('DNI es requerido, debe ser numérico y tener al menos 7 dígitos.');
    }
    if (!nombre || nombre.trim() === '') {
        errors.push('Nombre es un campo obligatorio.');
    }
    if (!apellido || apellido.trim() === '') {
        errors.push('Apellido es un campo obligatorio.');
    }
    if (!fecha_nacimiento) {
        errors.push('Fecha de Nacimiento es un campo obligatorio.');
    } else {
        try {
            const date = new Date(fecha_nacimiento);
            if (isNaN(date.getTime())) {
                errors.push('Fecha de Nacimiento debe ser una fecha válida.');
            }
        } catch (e) {
            errors.push('Fecha de Nacimiento debe ser una fecha válida.');
        }
    }
    const sexosValidos = ['m', 'f', 'otro'];
    if (!sexo || !sexosValidos.includes(sexo)) {
        errors.push('Sexo es un campo obligatorio y debe ser "m", "f" o "otro".');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email es un campo obligatorio y debe ser una dirección de email válida.');
    }

    if (errors.length > 0) {
        console.log('ValidationPaciente errors:', errors);
        
        let pacienteData = null;
        if (isModifying && req.params.id) {
             pacienteData = await db.Paciente.findByPk(req.params.id).catch(e => {
                console.error("Error al recuperar paciente para re-renderizar en validación:", e);
                return null;
            });
        }
        return renderPacienteFormWithError(req, res, errors, formView, pacienteData);
    }
    next();
}



async function validateAdmision(req, res, next) {
    const { id_cama, motivo, tipo_ingreso } = req.body;
    let errors = [];

    if (!id_cama) {
        errors.push('Debe seleccionar una cama.');
    }
    if (!motivo || motivo.trim() === '') {
        errors.push('El motivo de admisión es requerido.');
    }
    const tiposIngresoValidos = ['emergencia', 'programada', 'derivada'];
    if (!tipo_ingreso || !tiposIngresoValidos.includes(tipo_ingreso)) {
        errors.push('Tipo de ingreso inválido. Los valores permitidos son: ' + tiposIngresoValidos.join(', ') + '.');
    }

    if (errors.length > 0) {
        console.log('ValidationAdmision errors:', errors);
        
        return renderAdmisionFormWithError(req, res, errors);
    }
    next();
}

module.exports = {
    validatePaciente,
    validateAdmision
};