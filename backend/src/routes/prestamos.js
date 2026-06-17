import { Router } from 'express';
import {
  listar,
  buscarPorId,
  listarPorUsuario,
  realizar,
  devolver
} from '../controllers/prestamoController.js';

const router = Router();

router.get('/', listar);
router.get('/:id', buscarPorId);
router.get('/usuario/:usuarioId', listarPorUsuario);
router.post('/', realizar);
router.put('/:id/devolver', devolver);

export default router;