import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Autor = sequelize.define('Autor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nacionalidad: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'autores',
  timestamps: true
});

export default Autor;