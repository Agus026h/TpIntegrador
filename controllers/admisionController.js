const db = require('../config/db');
const camaUtils = require('../models/camaUtils.js');


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


async function mostrarFormularioNuevaAdmision(req, res) {
    try {
        console.log('DEBUG: Entrando a mostrarFormularioNuevaAdmision.');
        const camasDisponibles = await camaUtils.getCamasDisponibles();
        console.log('DEBUG: Camas disponibles cargadas:', camasDisponibles.length);
        res.render('admision/nueva_admision', {
            titulo: 'Nueva Admisión de Paciente',
            paciente: null,
            camasDisponibles: camasDisponibles,
            formData: {}
        });
        console.log('DEBUG: Formulario de admisión renderizado.');
    } catch (error) {
        console.error('ERROR CRÍTICO en mostrarFormularioNuevaAdmision:', error);
        res.status(500).send('Error interno del servidor al cargar el formulario de admisión.');
    }
}
// Buscar un paciente por DNI
async function buscarPacientePorDNI(req, res) {
    let { dni } = req.body;
    let paciente = null;
    let error = null;
    let linkRegistroPaciente = null;

    try {
        paciente = await db.Paciente.findOne({ where: { dni: dni } });
        if (!paciente) {
            error = 'Paciente con DNI ' + dni + ' no encontrado. Haz clic';
            linkRegistroPaciente = '/pacientes/nuevo';
        }
    } catch (err) {
        console.error('Error al buscar paciente:', err);
        error = 'Error al buscar paciente.';
    }

    let camasDisponibles = [];
    try {
        camasDisponibles = await camaUtils.getCamasDisponibles();
    } catch (err) {
        console.error('Error al cargar camas disponibles para renderizar el formulario:', err);
        error = (error ? error + '<br>' : '') + 'Error al cargar camas disponibles.';
    }

    res.render('admision/nueva_admision', {
        titulo: 'Nueva Admisión de Paciente',
        paciente: paciente,
        error: error,
        linkRegistroPaciente: linkRegistroPaciente,
        camasDisponibles: camasDisponibles,
        formData: req.body
    });
}

// Crear una nueva admision
async function crearNuevaAdmision(req, res, next) {
    let {
        dni, id_cama, motivo, tipo_ingreso
    } = req.body;

    console.log('1. Iniciando crearNuevaAdmision para DNI:', dni);

    let transaction;

    try {
        transaction = await db.sequelize.transaction();
        console.log('2. Transacción iniciada con ID:', transaction.id);

        const paciente = await db.Paciente.findOne({ where: { dni: dni }, transaction });
        console.log('3. Paciente encontrado:', paciente ? paciente.id_paciente : 'No encontrado');

        if (!paciente) {
            console.log('ERROR: Paciente no encontrado, lanzando error para re-renderizar.');
            await transaction.rollback();
            return renderAdmisionFormWithError(req, res, ['Paciente no encontrado para la admisión. Regístrelo primero.'], null, '/pacientes/nuevo');
        }

        const nuevaAdmision = await db.Admision.create({
            id_paciente: paciente.id_paciente,
            id_cama: id_cama,
            fecha: new Date(),
            motivo: motivo,
            tipo_ingreso: tipo_ingreso,
            estado: 'activa'
        }, { transaction });
        console.log('4. Nueva admisión creada (ID):', nuevaAdmision.id_admision, 'Tipo Ingreso:', nuevaAdmision.tipo_ingreso);

        await camaUtils.actualizarEstadoCama(id_cama, 'ocupada', transaction);
        console.log(`5. Estado de la cama ${id_cama} actualizado a 'ocupada'.`);

        await transaction.commit();
        console.log('6. Transacción commiteada. Redirigiendo...');

        res.redirect('/admisiones/activas?exito=true');
        console.log('7. Redirección enviada.');

    } catch (error) {
        console.error('ERROR en crearNuevaAdmision (capturado en catch):', error);
        if (transaction) {
            console.log('ERROR: Realizando rollback de la transacción con ID:', transaction.id);
            await transaction.rollback();
        }

        await renderAdmisionFormWithError(req, res, [error.message || 'Error al procesar la admisión. Por favor, revise los datos.']);
    }
}


async function mostrarAdmisionesActivas(req, res) {
    try {
        const mensajeExito = req.query.exito ? 'Admisión registrada exitosamente.' : null;

        const rawAdmisiones = await db.Admision.findAll({
            where: {
                estado: 'activa'
            },
            include: [
                {
                    model: db.Paciente,
                    as: 'paciente'
                },
                {
                    model: db.Cama,
                    as: 'cama',
                    include: [
                        {
                            model: db.Habitacion,
                            as: 'habitacion',
                            include: [
                                {
                                    model: db.Ala,
                                    as: 'ala'
                                }
                            ]
                        }
                    ]
                }
                
            ],
            order: [['fecha', 'DESC']]
        });

        const admisionesParaVista = rawAdmisiones.map(admision => {
            return {
                id_admision: admision.id_admision,
                paciente_nombre: admision.paciente ? admision.paciente.nombre : 'N/A',
                paciente_apellido: admision.paciente ? admision.paciente.apellido : 'N/A',
                paciente_dni: admision.paciente ? admision.paciente.dni : 'N/A',
                numero_cama: admision.cama ? admision.cama.numero : 'N/A',
                numero_habitacion: admision.cama && admision.cama.habitacion ? admision.cama.habitacion.numero : 'N/A',
                nombre_ala: admision.cama && admision.cama.habitacion && admision.cama.habitacion.ala ? admision.cama.habitacion.ala.nombre : 'N/A',
                fecha_ingreso: admision.fecha,
                motivo_internacion: admision.motivo,
                
                tipo_ingreso: admision.tipo_ingreso
            };
        });

        res.render('admision/lista_admisiones', { 
            titulo: 'Admisiones Activas',
            admisiones: admisionesParaVista,
            mensajeExito: mensajeExito
        });

    } catch (error) {
        console.error('ERROR al mostrar admisiones activas:', error);
        res.status(500).send('Error interno del servidor al cargar las admisiones activas.');
    }
}

async function cancelarAdmision(req, res) {
    const admisionId = req.params.id; 

    try {
        
        await db.sequelize.transaction(async (t) => {
            // Encontrar la admision
            const admision = await db.Admision.findByPk(admisionId, { transaction: t });

            if (!admision) {
                
                return res.redirect('/admisiones/activas?error=Admision no encontrada.');
            }

            
            if (admision.estado !== 'activa') {
                return res.redirect('/admisiones/activas?error=La admision ya no esta activa y no puede ser cancelada.');
            }

            
            admision.estado = 'cancelada';
            
            admision.fecha_egreso = new Date();
            await admision.save({ transaction: t });

            //Liberar la cama asociada 
            if (admision.id_cama) {
                const cama = await db.Cama.findByPk(admision.id_cama, { transaction: t });
                if (cama) {
                    cama.estado = 'libre'; 
                    await cama.save({ transaction: t });
                }
            }

            
            return res.redirect('/admisiones/activas?success=Admision ' + admisionId + ' cancelada exitosamente.');

        });

    } catch (error) {
        console.error('Error al cancelar la admision:', error); 
        return res.redirect('/admisiones/activas?error=Error al cancelar la admision. Por favor, intente de nuevo.');
    }
}



async function finalizarAdmision(req, res) {
    const admisionId = req.params.id;

    try {
        await db.sequelize.transaction(async (t) => {
            const admision = await db.Admision.findByPk(admisionId, { transaction: t });

            if (!admision) {
                return res.redirect('/admisiones/activas?error=Admision no encontrada.');
            }

            if (admision.estado !== 'activa') {
                return res.redirect('/admisiones/activas?error=La admision no esta activa y no puede ser finalizada.');
            }

            // Cambiar el estado a 'finalizada'
            admision.estado = 'finalizada';
            admision.fecha_egreso = new Date();

            await admision.save({ transaction: t });

            // Liberar la cama asociada
            if (admision.id_cama) {
                const cama = await db.Cama.findByPk(admision.id_cama, { transaction: t });
                if (cama) {
                    cama.estado = 'libre';
                    await cama.save({ transaction: t });
                }
            }

            return res.redirect('/admisiones/activas?success=Admision ' + admisionId + ' finalizada exitosamente.');
        });

    } catch (error) {
        console.error('Error al finalizar la admisión:', error);
        return res.redirect('/admisiones/activas?error=Error al finalizar la admision. Por favor, intente de nuevo.');
    }
}

module.exports = {
    mostrarFormularioNuevaAdmision,
    buscarPacientePorDNI,
    crearNuevaAdmision,
    mostrarAdmisionesActivas,
    cancelarAdmision,
    finalizarAdmision
};