import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Libro = sequelize.define('Libro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING(20),
    unique: true
  },
  categoria: {
    type: DataTypes.STRING(100)
  },
  anio: {
    type: DataTypes.INTEGER
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'prestado', 'reservado'),
    defaultValue: 'disponible'
  },
  descripcion: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'libros',
  timestamps: true
});

export default Libro;