const db = require('../config/db');

async function getCamasDisponibles() {
    try {
        const camas = await db.Cama.findAll({
            where: { estado: 'libre' },
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
        });
        return camas;
    } catch (error) {
        console.error('Error al obtener camas disponibles en camaUtils:', error);
        throw error;
    }
}


async function actualizarEstadoCama(idCama, nuevoEstado, transaction = null) { 
    try {
        console.log(`Intentando actualizar cama ${idCama} a estado '${nuevoEstado}' (transacción pasada: ${transaction ? 'sí, ID: ' + transaction.id : 'no'}).`); // <-- LOG ADICIONAL CON ID

        
        const cama = await db.Cama.findByPk(idCama, { transaction }); 

        if (cama) {
            cama.estado = nuevoEstado;
            await cama.save({ transaction }); 
            console.log(`Cama ${idCama} actualizada a '${nuevoEstado}' dentro de la transacción.`); 
        } else {
            console.warn(`Cama con ID ${idCama} no encontrada para actualizar estado.`);
        }
    } catch (error) {
        console.error(`Error en actualizarEstadoCama para cama ${idCama}:`, error);
        throw error; 
    }
}

module.exports = {
    getCamasDisponibles,
    actualizarEstadoCama
};