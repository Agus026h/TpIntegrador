const db = require('../config/db');
const camaUtils = require('../models/camaUtils');


async function renderAdmisionFormWithError(req, res, errorMessages, paciente = null, linkRegistroPaciente = null) {
    let pacienteRecuperado = paciente;
    if (!pacienteRecuperado && req.body.dni) {
        try {
            pacienteRecuperado = await db.Paciente.findOne({ where: { dni: req.body.dni } });
        } catch (err) {
            console.error('Error al intentar recuperar paciente para re-renderizar formulario:', err);
        }
    }

    let camasDisponibles = [];
    try {
        camasDisponibles = await camaUtils.getCamasDisponibles();
    } catch (err) {
        console.error('Error al cargar camas disponibles para re-renderizar el formulario:', err);
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



function validatePaciente(req, res, next) {
    const { dni, nombre, apellido, fecha_nacimiento, sexo, email } = req.body;
    let errors = [];

    if (!dni || dni.length < 7) {
        errors.push('DNI es requerido y debe tener al menos 7 dígitos.');
    }
    if (!nombre) {
        errors.push('Nombre es un campo obligatorio.');
    }
    if (!apellido) {
        errors.push('Apellido es un campo obligatorio.');
    }
    if (!fecha_nacimiento) {
        errors.push('Fecha de Nacimiento es un campo obligatorio y debe ser una fecha válida.');
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
        // Utiliza la función auxiliar para re-renderizar el formulario en caso de error
        // Aquí deberías re-renderizar un formulario de paciente, no de admisión,
        // o si es la misma vista, asegúrate que renderAdmisionFormWithError maneja bien esto.
        // Pero idealmente, esta validación se usa en /pacientes/nuevo.
        // Por simplicidad, si es el mismo form, se reusa la función:
        return renderAdmisionFormWithError(req, res, errors);
    }
    next();
}


// validateAdmision: Este middleware valida solo los campos de la admisión.
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
    validatePaciente, // <-- Ahora sí existe esta función
    validateAdmision
};