const db = require('../config/db'); 


async function getHistorialAdmisionesPaciente(idPaciente) {
    try {
        const historial = await db.Admision.findAll({
            where: { id_paciente: idPaciente },
            order: [['fecha', 'DESC']],
            include: [
                { model: db.Cama, as: 'cama', include: [{ model: db.Habitacion, as: 'habitacion' }] }
                
            ]
        });
        return historial;
    } catch (error) {
        console.error(`Error al obtener historial de admisiones para paciente ${idPaciente}:`, error);
        throw error;
    }
}

module.exports = {
    getHistorialAdmisionesPaciente
    
};