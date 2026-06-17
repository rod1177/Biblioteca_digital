import { Router } from 'express';
import {
  listar,
  listarPendientes,
  listarPorUsuario,
  pagar
} from '../controllers/multaController.js';

const router = Router();

router.get('/', listar);
router.get('/pendientes', listarPendientes);
router.get('/usuario/:usuarioId', listarPorUsuario);
router.put('/:id/pagar', pagar);

export default router;