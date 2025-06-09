module.exports = (sequelize, DataTypes) => {
  const Habitacion = sequelize.define('Habitacion', {
    id_habitacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'habitacion', 
    timestamps: false
  });

  Habitacion.associate = (models) => {
    Habitacion.belongsTo(models.Ala, {
      foreignKey: 'id_ala',
      as: 'ala'
    });
    Habitacion.hasMany(models.Cama, {
      foreignKey: 'id_habitacion',
      as: 'camas'
    });
  };

  return Habitacion;
};