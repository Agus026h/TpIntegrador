const db = require('../config/db'); 


async function getCamasDisponibles() {
    try {
        
        const camas = await db.Cama.findAll({
            where: { estado: 'libre' },
           
            include: [
                { model: db.Habitacion, as: 'habitacion', include: [{ model: db.Ala, as: 'ala' }] }
            ]
        });
        return camas;
    } catch (error) {
        console.error('Error al obtener camas disponibles:', error);
        throw error; 
    }
}


async function actualizarEstadoCama(idCama, nuevoEstado) {
    try {
        const [filasActualizadas] = await db.Cama.update(
            { estado: nuevoEstado },
            { where: { id_cama: idCama } }
        );
        return filasActualizadas > 0; 
    } catch (error) {
        console.error(`Error al actualizar estado de la cama ${idCama}:`, error);
        throw error;
    }
}

module.exports = {
    getCamasDisponibles,
    actualizarEstadoCama
};