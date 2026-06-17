import app from './app.js';
import { testConnection } from './config/database.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  await testConnection();
  await sequelize.sync({ alter: false });
  console.log('Tablas sincronizadas');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

start(); 