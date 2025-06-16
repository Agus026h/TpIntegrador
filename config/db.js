const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config(); 


const DB_DATABASE = process.env.PGDATABASE || process.env.DB_DATABASE; 
const DB_USER = process.env.PGUSER || process.env.DB_USER;
const DB_PASSWORD = process.env.PGPASSWORD || process.env.DB_PASSWORD;
const DB_HOST = process.env.PGHOST || process.env.DB_HOST || 'localhost'; 
const DB_PORT = process.env.PGPORT || process.env.DB_PORT || 5432; 
const DB_DIALECT = 'postgres'; 

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT, 
    logging: console.log,
    dialectOptions: {
        
        ssl: {
            require: true, 
            rejectUnauthorized: false 
        }
    },
    timezone: '-03:00'
});

const db = {};

const modelsDir = path.join(__dirname, '../models');

// Lee todos los archivos en el directorio models
fs.readdirSync(modelsDir)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== 'index.js' &&
            file.slice(-3) === '.js' &&
            !file.endsWith('Utils.js')
        );
    })
    .forEach(file => {
        
        const model = require(path.join(modelsDir, file))(sequelize, DataTypes);
        db[model.name] = model;
    });

// Establecer asociaciones entre los modelos
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


async function testConnection() {
    try {
        await sequelize.authenticate(); 
        console.log('Conexión a PostgreSQL con Sequelize exitosa!'); 

        await sequelize.sync({ alter: true }); //cambiar despues
        
        
        console.log('Modelos sincronizados con la base de datos.');

    } catch (error) {
        console.error('Error al conectar a la base de datos o sincronizar modelos:', error);
        process.exit(1);
    }
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testConnection = testConnection;

module.exports = db;