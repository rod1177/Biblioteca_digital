import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Prestamo = sequelize.define('Prestamo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaPrestamo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fechaLimite: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaDevolucion: {
    type: DataTypes.DATEONLY
  },
  estado: {
    type: DataTypes.ENUM('activo', 'devuelto', 'vencido'),
    defaultValue: 'activo'
  }
}, {
  tableName: 'prestamos',
  timestamps: true
});

export default Prestamo;