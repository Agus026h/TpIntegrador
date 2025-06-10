const db = require('../config/db'); 


function calcularEdadPaciente(fechaNacimiento) {
    if (!fechaNacimiento) {
        return -1; // 
    }
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    if (isNaN(nacimiento.getTime())) { 
        return -1;
    }

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}


async function buscarPacientesPorCriterios(criterios) {
    try {
        const pacientes = await db.Paciente.findAll({
            where: criterios 
        });
        return pacientes;
    } catch (error) {
        console.error('Error al buscar pacientes por criterios en pacienteUtils:', error);
        throw error; 
    }
}



module.exports = {
    calcularEdadPaciente,
    buscarPacientesPorCriterios
};