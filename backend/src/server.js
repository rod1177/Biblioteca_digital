import app from './app.js';
import { testConnection } from './config/database.js';
import { sequelize } from './models/index.js';
import { crearAdminInicial } from './seeders/adminSeeder.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await testConnection();
  await sequelize.sync({ alter: false });
  console.log('Tablas sincronizadas');
  await crearAdminInicial();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

start();
