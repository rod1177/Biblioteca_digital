import { Router } from 'express';
import {
  listar,
  listarDisponibles,
  buscarPorId,
  crear,
  actualizar,
  eliminar
} from '../controllers/libroController.js';

const router = Router();

router.get('/', listar);
router.get('/disponibles', listarDisponibles);
router.get('/:id', buscarPorId);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;