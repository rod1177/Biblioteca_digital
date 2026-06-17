import { Router } from 'express';
import {
  registrar,
  login,
  listar,
  buscarPorId,
  actualizar,
  eliminar
} from '../controllers/usuarioController.js';

const router = Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/', listar);
router.get('/:id', buscarPorId);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;