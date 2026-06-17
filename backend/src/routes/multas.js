import { Router } from 'express';
import {
  listar, listarPendientes, listarPorUsuario, pagar
} from '../controllers/multaController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

// Admin ve todas
router.get('/', verificarToken, soloAdmin, listar);
router.get('/pendientes', verificarToken, soloAdmin, listarPendientes);

// Usuario ve las suyas y puede pagar
router.get('/usuario/:usuarioId', verificarToken, listarPorUsuario);
router.put('/:id/pagar', verificarToken, pagar);

export default router;