import { Router } from 'express';
import {
  registrar,
  login,
  listar,
  buscarPorId,
  actualizar,
  eliminar
} from '../controllers/usuarioController.js';
import { verificarToken, soloAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/',     verificarToken, soloAdmin, listar);   // solo admin
router.get('/:id',  verificarToken, buscarPorId);
router.put('/:id',  verificarToken, actualizar);
router.delete('/:id', verificarToken, soloAdmin, eliminar);

export default router;
