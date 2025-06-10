const db = require('../config/db');
const { validatePaciente } = require('../middlewares/validationMiddleware'); 

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
            sexo: ['m', 'f', 'otro', ''].includes(sexo) ? sexo : null,
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
        
        res.status(400).render('paciente/nuevo_paciente', {
            titulo: 'Registrar Nuevo Paciente',
            error: error.message || 'Error al registrar el paciente. Verifique los datos.',
            formData: req.body
        });
        
    }
}

module.exports = {
    mostrarFormularioNuevoPaciente,
    crearNuevoPaciente
};