module.exports = (sequelize, DataTypes) => {
  const Admision = sequelize.define('Admision', {
    id_admision: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_cama: {
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    tipo_ingreso: {
      type: DataTypes.ENUM('emergencia', 'programada', 'derivada'),
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('activa', 'cancelada', 'finalizada'), 
      allowNull: false
    }
  }, {
    tableName: 'admision', 
    timestamps: false
  });

  Admision.associate = (models) => {
    Admision.belongsTo(models.Paciente, {
      foreignKey: 'id_paciente',
      as: 'paciente'
    });
    Admision.belongsTo(models.Cama, {
      foreignKey: 'id_cama',
      as: 'cama'
    });
    
  };

  return Admision;
};