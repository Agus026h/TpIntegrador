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
                console.error('Error recuperando paciente para re-renderizar en validación:', err);
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


function validatePaciente(req, res, next) {
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
             db.Paciente.findByPk(req.params.id).then(foundPaciente => {
                pacienteData = foundPaciente;
                return renderPacienteFormWithError(req, res, errors, formView, pacienteData);
            }).catch(e => {
                console.error("Error al recuperar paciente para re-renderizar en validación:", e);
                return renderPacienteFormWithError(req, res, errors, formView, null); 
            });
            return; 
        }
        return renderPacienteFormWithError(req, res, errors, formView, pacienteData);
    }
    next();
}


// validateAdmision: Este middleware valida los campos de la admision.
async function validateAdmision(req, res, next) {
    const { dni, id_cama, motivo, tipo_ingreso } = req.body; 
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

    try {
        const camaSeleccionada = await db.Cama.findByPk(id_cama, {
            include: [{ model: db.Habitacion, as: 'habitacion' }]
        });

        if (!camaSeleccionada) {
            errors.push('La cama seleccionada no es válida o no existe.');
        } else if (camaSeleccionada.habitacion && camaSeleccionada.habitacion.capacidad === 2) {
            // Si la habitacion es de 2 camas, buscar la otra cama
            const otraCamaEnHabitacion = await db.Cama.findOne({
                where: {
                    id_habitacion: camaSeleccionada.id_habitacion,
                    id_cama: { [db.Sequelize.Op.ne]: id_cama }, 
                    estado: 'ocupada' 
                }
            });

            if (otraCamaEnHabitacion) {
                
                const admisionEnOtraCama = await db.Admision.findOne({
                    where: {
                        id_cama: otraCamaEnHabitacion.id_cama,
                        estado: 'activa' // Solo admisiones activas
                    },
                    include: [{ model: db.Paciente, as: 'paciente', attributes: ['sexo'] }] 
                });

                if (admisionEnOtraCama && admisionEnOtraCama.paciente) {
                    const sexoPacienteEnOtraCama = admisionEnOtraCama.paciente.sexo;

                    // Obtener el sexo del paciente
                    const pacienteAdmitir = await db.Paciente.findOne({
                        where: { dni: dni },
                        attributes: ['sexo']
                    });

                    if (pacienteAdmitir && pacienteAdmitir.sexo !== sexoPacienteEnOtraCama) {
                        errors.push(`No se puede asignar la cama. La habitación ya está ocupada por un paciente de sexo diferente (${sexoPacienteEnOtraCama === 'm' ? 'masculino' : sexoPacienteEnOtraCama === 'f' ? 'femenino' : 'otro sexo'}).`);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error durante la validación de cama/sexo:', err);
        errors.push('Error al verificar la disponibilidad de la cama. Intente de nuevo.');
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