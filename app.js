const express = require('express');
const path = require('path');
const db = require('./config/db'); 
const app = express();
const port = 3000;

// Importar middlewares
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

// Importar rutas
const admisionRoutes = require('./routes/admisionRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes'); 

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares de Express
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // 
app.use(express.static(path.join(__dirname, 'public'))); 

// Montar las rutas
app.use('/admisiones', admisionRoutes);
app.use('/pacientes', pacienteRoutes); 


app.get('/', (req, res) => {
    const datosPaginaInicio = {
        titulo: 'Sistema de Gestión Hospitalaria',
        mensajeBienvenida: '¡Bienvenido a la página de inicio!',
        nombreUsuario: 'Usuario' 
    };
    res.render('index', datosPaginaInicio);
});


app.get('/acerca', (req, res) => {
    const datosPaginaAcerca = {
        titulo: 'Acerca de Nosotros',
        descripcion: 'Somos una institución hospitalaria ficticia dedicada a brindar atención de calidad a nuestros pacientes.',
        anioFundacion: 2023
    };
    res.render('acerca', datosPaginaAcerca);
});


app.use(notFoundHandler);


app.use(errorHandler);

// Sincronizar modelos con la base de datos y arrancar el servidor
db.sequelize.sync({ force: false }) 
    .then(() => {
        console.log('Base de datos sincronizada.');
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });