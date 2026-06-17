import { Router } from 'express';
import {
  listar, listarDisponibles, buscarPorId,
  crear, actualizar, eliminar
} from '../controllers/libroController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

// Cualquier usuario autenticado puede ver libros
router.get('/', verificarToken, listar);
router.get('/disponibles', verificarToken, listarDisponibles);
router.get('/:id', verificarToken, buscarPorId);

// Solo admin puede modificar libros
router.post('/', verificarToken, soloAdmin, crear);
router.put('/:id', verificarToken, soloAdmin, actualizar);
router.delete('/:id', verificarToken, soloAdmin, eliminar);

export default router;