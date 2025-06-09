module.exports = (sequelize, DataTypes) => {
  const Paciente = sequelize.define('Paciente', {
    id_paciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dni: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      unique: 'composite_unique_dni_email' 
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY, // Solo la fecha
      allowNull: false
    },
    sexo: {
      type: DataTypes.ENUM('m', 'f', 'otro'), 
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: 'composite_unique_dni_email' 
    },
    contacto_emergencia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN, 
      allowNull: false
    }
  }, {
    tableName: 'paciente', 
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['dni', 'email'] 
      }
    ]
  });

  Paciente.associate = (models) => {
    Paciente.hasMany(models.Admision, {
      foreignKey: 'id_paciente',
      as: 'admisiones'
    });
  };

  return Paciente;
};