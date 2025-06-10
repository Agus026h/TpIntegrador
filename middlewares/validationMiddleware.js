const validatePaciente = (req, res, next) => {
    const { dni, nombre, apellido, fecha_nacimiento, sexo, email } = req.body;
    const errors = [];

    

    if (!dni || dni.toString().trim().length === 0) {
        errors.push('DNI es un campo obligatorio.');
    } else if (isNaN(dni) || dni.toString().trim().length < 7 || dni.toString().trim().length > 10) {
        errors.push('DNI debe ser un número válido de 7 a 10 dígitos.');
    }

    if (!nombre || nombre.trim().length === 0) {
        errors.push('Nombre es un campo obligatorio.');
    }
    if (!apellido || apellido.trim().length === 0) {
        errors.push('Apellido es un campo obligatorio.');
    }
    if (!fecha_nacimiento || isNaN(new Date(fecha_nacimiento))) {
        errors.push('Fecha de Nacimiento es un campo obligatorio y debe ser una fecha válida.');
    }
    if (!sexo || !['m', 'f', 'otro'].includes(sexo.toLowerCase())) {
        errors.push('Sexo es un campo obligatorio y debe ser "m", "f" o "otro".');
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        errors.push('Email es un campo obligatorio y debe ser una dirección de email válida.');
    }

    if (errors.length > 0) {
       
        return res.status(400).render('admision/nueva_admision', {
            titulo: 'Nueva Admisión de Paciente',
            error: errors.join('<br>'),
            paciente: null,
            camasDisponibles: res.locals.camasDisponibles || [],
            formData: req.body 
        });
    }
    next(); 
};


const validateAdmision = (req, res, next) => {
    const { id_cama, motivo, tipo_ingreso } = req.body;
    const errors = [];

    if (!id_cama || isNaN(id_cama)) {
        errors.push('Debe seleccionar una cama válida.');
    }
    if (!motivo || motivo.trim().length === 0) {
        errors.push('Motivo de Admisión es un campo obligatorio.');
    }
    
    if (!tipo_ingreso || !['urgencia', 'programada', 'derivacion'].includes(tipo_ingreso.toLowerCase())) {
        errors.push('Tipo de Ingreso es un campo obligatorio y debe ser "urgencia", "programada" o "derivacion".');
    }

    if (errors.length > 0) {

        return res.status(400).render('admision/nueva_admision', {
            titulo: 'Nueva Admisión de Paciente',
            error: errors.join('<br>'),
            paciente: null, 
            camasDisponibles: res.locals.camasDisponibles || [],
            formData: req.body
        });
    }
    next();
};

module.exports = {
    validatePaciente,
    validateAdmision,
  
};