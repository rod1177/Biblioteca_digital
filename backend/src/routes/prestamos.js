import { Router } from 'express';
import {
  listar, buscarPorId, listarPorUsuario,
  realizar, devolver
} from '../controllers/prestamoController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

// Admin ve todos, usuario ve los suyos
router.get('/', verificarToken, soloAdmin, listar);
router.get('/usuario/:usuarioId', verificarToken, listarPorUsuario);
router.get('/:id', verificarToken, buscarPorId);

// Cualquier usuario autenticado puede pedir/devolver
router.post('/', verificarToken, realizar);
router.put('/:id/devolver', verificarToken, devolver);

export default router;