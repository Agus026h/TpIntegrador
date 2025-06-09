module.exports = (sequelize, DataTypes) => {
  const Ala = sequelize.define('Ala', {
    id_ala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'ala', 
    timestamps: false 
  });

  Ala.associate = (models) => {
    Ala.hasMany(models.Habitacion, {
      foreignKey: 'id_ala',
      as: 'habitaciones'
    });
  };

  return Ala;
};