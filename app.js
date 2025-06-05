
const express = require('express');
const path = require('path'); 
const app = express();
const port = 3000;


app.set('view engine', 'pug');


app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));



// Ruta para la página de inicio (Home)
app.get('/', (req, res) => {
   
    const datosPaginaInicio = {
        titulo: 'Mi Sitio Web con Pug y Express (Solo Vistas)',
        mensajeBienvenida: '¡Bienvenido a la página de inicio de tu HIS!',
        nombreUsuario: 'Paciente Demo'
    };
    
    res.render('index', datosPaginaInicio);
});


app.get('/acerca', (req, res) => {
    
    const datosPaginaAcerca = {
        titulo: 'Acerca de Nosotros',
        descripcion: 'Somos una institucion hospitalaria ficticia dedicada a brindar atencion de calidad.',
        anioFundacion: 2023
    };
    
    res.render('acerca', datosPaginaAcerca);
});


app.get('/admisiones/nueva', (req, res) => {
    
    res.render('admision/nueva_admision', {
        titulo: 'Formulario de Nueva Admision',
        error: null,
        paciente: null, 
        camasDisponibles: [] 
    });
});


app.get('/admisiones/activas', (req, res) => {
    
    res.render('admision/lista_admisiones', {
        titulo: 'Lista de Admisiones (Vista Previa)',
        admisiones: [] 
    });
});





// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express (solo vistas) escuchando en http://localhost:${port}`);
    console.log(`Visita la página de inicio en http://localhost:${port}`);
    console.log(`Visita la página "Acerca de" en http://localhost:${port}/acerca`);
    console.log(`Previsualiza el formulario de admisión en http://localhost:${port}/admisiones/nueva`);
    console.log(`Previsualiza la lista de admisiones en http://localhost:${port}/admisiones/activas`);
});