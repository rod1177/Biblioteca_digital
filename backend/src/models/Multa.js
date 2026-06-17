import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Multa = sequelize.define('Multa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  diasRetraso: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pagada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fechaPago: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'multas',
  timestamps: true
});

export default Multa;