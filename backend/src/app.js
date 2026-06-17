import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usuariosRouter from './routes/usuarios.js';
import librosRouter from './routes/libros.js';
import prestamosRouter from './routes/prestamos.js';
import multasRouter from './routes/multas.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/libros', librosRouter);
app.use('/api/prestamos', prestamosRouter);
app.use('/api/multas', multasRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Biblioteca Digital API funcionando ✅',
    endpoints: {
      usuarios: '/api/usuarios',
      libros: '/api/libros',
      prestamos: '/api/prestamos',
      multas: '/api/multas'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;