module.exports = (sequelize, DataTypes) => {
  const Cama = sequelize.define('Cama', {
    id_cama: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.ENUM('libre', 'ocupada', 'higienizacion'), 
      allowNull: false,
      defaultValue: 'libre'
    },
    id_habitacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'cama', 
    timestamps: false
  });

  Cama.associate = (models) => {
    Cama.belongsTo(models.Habitacion, {
      foreignKey: 'id_habitacion',
      as: 'habitacion'
    });
    Cama.hasMany(models.Admision, { 
      foreignKey: 'id_cama',
      as: 'admisiones'
    });
  };

  return Cama;
};