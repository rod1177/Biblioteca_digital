import sequelize from '../config/database.js';
import Usuario from './Usuario.js';
import Autor from './Autor.js';
import Libro from './Libro.js';
import Prestamo from './Prestamo.js';
import Multa from './Multa.js';

// Un Autor tiene muchos Libros
Autor.hasMany(Libro, { foreignKey: 'autorId' });
Libro.belongsTo(Autor, { foreignKey: 'autorId' });

// Un Usuario tiene muchos Prestamos
Usuario.hasMany(Prestamo, { foreignKey: 'usuarioId' });
Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Un Libro tiene muchos Prestamos
Libro.hasMany(Prestamo, { foreignKey: 'libroId' });
Prestamo.belongsTo(Libro, { foreignKey: 'libroId' });

// Un Prestamo puede tener una Multa
Prestamo.hasOne(Multa, { foreignKey: 'prestamoId' });
Multa.belongsTo(Prestamo, { foreignKey: 'prestamoId' });

// Un Usuario puede tener muchas Multas
Usuario.hasMany(Multa, { foreignKey: 'usuarioId' });
Multa.belongsTo(Usuario, { foreignKey: 'usuarioId' });

export { sequelize, Usuario, Autor, Libro, Prestamo, Multa };