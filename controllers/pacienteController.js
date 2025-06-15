const db = require('../config/db');

// const { validatePaciente } = require('../middlewares/validationMiddleware');
// const { Op } = require('sequelize');

async function mostrarFormularioNuevoPaciente(req, res, next) {
    try {
        res.render('paciente/nuevo_paciente', {
            titulo: 'Registrar Nuevo Paciente',
            error: null,
            mensajeExito: req.query.exito === 'true' ? 'Paciente registrado exitosamente. Ya puedes realizar una admisión para él.' : null,
            formData: {}
        });
    } catch (error) {
        console.error('Error al cargar formulario de nuevo paciente:', error);
        next(error);
    }
}

async function crearNuevoPaciente(req, res, next) {
    const { dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, contacto_emergencia } = req.body;

    try {
        const pacienteExistente = await db.Paciente.findOne({ where: { dni: dni } });
        if (pacienteExistente) {
            return res.status(409).render('paciente/nuevo_paciente', {
                titulo: 'Registrar Nuevo Paciente',
                error: `Ya existe un paciente registrado con el DNI ${dni}.`,
                formData: req.body
            });
        }

        const nuevoPaciente = await db.Paciente.create({
            dni, nombre, apellido, fecha_nacimiento,
            sexo: ['m', 'f', 'otro'].includes(sexo) ? sexo : null, 
            direccion: direccion || null,
            telefono: telefono || null,
            email,
            contacto_emergencia: contacto_emergencia || null,
            estado: true 
        });

        console.log('Nuevo paciente registrado:', nuevoPaciente.id_paciente);
        res.redirect('/pacientes/nuevo?exito=true');

    } catch (error) {
        console.error('Error al registrar nuevo paciente:', error);
       
        let errorMessage = 'Error al registrar el paciente. Verifique los datos.';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = 'El DNI o Email ya están registrados para otro paciente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(400).render('paciente/nuevo_paciente', {
            titulo: 'Registrar Nuevo Paciente',
            error: errorMessage,
            formData: req.body
        });
    }
}




async function mostrarFormularioBuscarPacienteModificar(req, res) {
    res.render('paciente/buscar_paciente_modificar', {
        titulo: 'Modificar Paciente',
        pacienteEncontrado: null,
        error: null,
        mensajeExito: req.query.exito || null, 
        formData: {}
    });
}


async function buscarPacienteParaModificar(req, res) {
    const { dni } = req.body;
    let paciente = null;
    let error = null;

    if (!dni || dni.trim() === '') {
        error = 'Por favor, ingrese un DNI para buscar.';
    } else {
        try {
            paciente = await db.Paciente.findOne({ where: { dni: dni } });
            if (!paciente) {
                error = 'Paciente con DNI ' + dni + ' no encontrado.';
            }
        } catch (err) {
            console.error('Error al buscar paciente para modificar:', err);
            error = 'Error interno al buscar paciente.';
        }
    }

    res.render('paciente/buscar_paciente_modificar', {
        titulo: 'Modificar Paciente',
        pacienteEncontrado: paciente, 
        error: error,
        formData: req.body
    });
}


async function mostrarFormularioModificarPaciente(req, res) {
    const pacienteId = req.params.id; 
    try {
        const paciente = await db.Paciente.findByPk(pacienteId);
        if (!paciente) {
            // Si el paciente no existe, redirigimos o mostramos un error
            return res.status(404).render('error', {
                titulo: 'Paciente no encontrado',
                error: 'Paciente con ID ' + pacienteId + ' no encontrado para modificar.'
            });
        }
        
        res.render('paciente/modificar_paciente', {
            titulo: 'Editar Datos de Paciente',
            paciente: paciente, 
            error: null,
            
            formData: paciente.toJSON()
        });
    } catch (error) {
        console.error('Error al cargar formulario de modificación de paciente:', error);
        res.status(500).render('error', {
            titulo: 'Error del Servidor',
            error: 'Error al cargar los datos del paciente para edición.'
        });
    }
}

async function modificarPaciente(req, res) {
    const pacienteId = req.params.id; 
    
    const { dni, nombre, apellido, fecha_nacimiento, sexo, direccion, telefono, email, contacto_emergencia, estado } = req.body;

    try {
        const paciente = await db.Paciente.findByPk(pacienteId);
        if (!paciente) {
            return res.status(404).render('error', {
                titulo: 'Paciente no encontrado',
                error: 'Paciente con ID ' + pacienteId + ' no encontrado para modificar.'
            });
        }

        // Antes de actualizar, verificar si el nuevo DNI/Email ya existe en otro paciente
        const pacienteExistente = await db.Paciente.findOne({
            where: {
               
                [db.Sequelize.Op.or]: [
                    { dni: dni },
                    { email: email }
                ],
                id_paciente: { [db.Sequelize.Op.ne]: pacienteId } 
            }
        });

        if (pacienteExistente) {
             let errorMessage = 'Ya existe un paciente con el DNI o Email ingresado.';
             if (pacienteExistente.dni === parseInt(dni)) { 
                 errorMessage = `Ya existe un paciente registrado con el DNI ${dni}.`;
             } else if (pacienteExistente.email === email) {
                 errorMessage = `Ya existe un paciente registrado con el Email ${email}.`;
             }
            return res.status(409).render('paciente/modificar_paciente', {
                titulo: 'Error al Editar Paciente',
                paciente: paciente, 
                error: errorMessage,
                formData: req.body 
            });
        }

        // Actualizar los campos del paciente
        paciente.dni = dni;
        paciente.nombre = nombre;
        paciente.apellido = apellido;
        paciente.fecha_nacimiento = fecha_nacimiento;
        paciente.sexo = ['m', 'f', 'otro'].includes(sexo) ? sexo : null; 
        paciente.direccion = direccion || null;
        paciente.telefono = telefono || null;
        paciente.email = email;
        paciente.contacto_emergencia = contacto_emergencia || null;
        paciente.estado = (estado === 'true' || estado === true); 

        await paciente.save(); 

        
        res.redirect('/pacientes/modificar?exito=Paciente+modificado+exitosamente.');

    } catch (error) {
        console.error('Error al modificar paciente:', error);

        const pacienteRecuperado = await db.Paciente.findByPk(pacienteId);
        res.status(400).render('paciente/modificar_paciente', {
            titulo: 'Error al Editar Paciente',
            paciente: pacienteRecuperado, 
            error: error.message || 'Error al procesar la modificación del paciente. Por favor, revise los datos.',
            formData: req.body 
        });
    }
}



async function getAllPacientes(req, res, next) {
    try {
        const pacientes = await db.Paciente.findAll({
            
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        
        const mensajeExito = req.flash('mensajeExito');
        const error = req.flash('error');

        res.render('pacientes/ver_pacientes', {
            titulo: 'Listado de Pacientes',
            pacientes: pacientes,
            mensajeExito: mensajeExito.length ? mensajeExito[0] : null,
            error: error.length ? error[0] : null 
        });
    } catch (err) {
        console.error('Error al obtener pacientes para el listado:', err);
        
        req.flash('error', 'No se pudieron cargar los pacientes. Intente de nuevo mas tarde.');
       
    }
}


async function listarPacientes(req, res, next) {
    try {
        const pacientes = await db.Paciente.findAll({
            where: {
                estado: true 
            },
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        const mensajeExito = req.query.exito ? decodeURIComponent(req.query.exito) : null;
        const error = req.query.error ? decodeURIComponent(req.query.error) : null;

        res.render('paciente/ver_pacientes', {
            titulo: 'Listado de Pacientes',
            pacientes: pacientes,
            mensajeExito: mensajeExito,
            error: error
        });
    } catch (err) {
        console.error('Error al obtener pacientes para el listado:', err);
        const errorMessage = encodeURIComponent('No se pudieron cargar los pacientes. Intente de nuevo mas tarde.');
        res.redirect(`/?error=${errorMessage}`); // Redirige al inicio con el error
    }
}


async function desactivarPaciente(req, res) { 
    try {
        const id_paciente = req.params.id;

        const paciente = await db.Paciente.findByPk(id_paciente);

        if (!paciente) {
            const errorMessage = encodeURIComponent('Paciente no encontrado para desactivar.');
            return res.redirect(`/pacientes?error=${errorMessage}`);
        }

        paciente.estado = false; // Cambiar el estado a inactivo
        await paciente.save();

        const successMessage = encodeURIComponent('Paciente desactivado exitosamente.');
        res.redirect(`/pacientes?exito=${successMessage}`);
    } catch (err) {
        console.error('Error al desactivar paciente:', err);
        const errorMessage = encodeURIComponent('Error al desactivar el paciente. Intente de nuevo más tarde.');
        res.redirect(`/pacientes?error=${errorMessage}`);
    }
}

async function getPacienteById(req, res) {
    try {
        const id_paciente = req.params.id;
        const paciente = await db.Paciente.findByPk(id_paciente);

        if (!paciente) {
            const errorMessage = encodeURIComponent('Paciente no encontrado.');
            return res.redirect(`/pacientes?error=${errorMessage}`);
        }
        res.render('pacientes/buscar_paciente_modificar', {
            titulo: 'Detalle del Paciente',
            paciente: paciente,
            mensajeExito: req.query.exito ? decodeURIComponent(req.query.exito) : null,
            error: req.query.error ? decodeURIComponent(req.query.error) : null
        });
    } catch (err) {
        console.error('Error al obtener detalle del paciente:', err);
        const errorMessage = encodeURIComponent('Error al cargar el detalle del paciente.');
        res.redirect(`/pacientes?error=${errorMessage}`);
    }
}



module.exports = {
    mostrarFormularioNuevoPaciente,
    crearNuevoPaciente,
    mostrarFormularioBuscarPacienteModificar,
    buscarPacienteParaModificar,
    mostrarFormularioModificarPaciente,
    modificarPaciente,
    listarPacientes,
    desactivarPaciente, 
    getPacienteById 
};