const Sequelize = require('sequelize');
const db = {};

const sequelize = new Sequelize(
 'hospital',
  'root',
  '', //no tiene constraseña
  {
    host: 'localhost',
    dialect: 'mysql',

  }


);



Object.keys(db).forEach(modelName => {
    if (db[modelName].assosiate){
       db[modelName].assosiate(db);


    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
