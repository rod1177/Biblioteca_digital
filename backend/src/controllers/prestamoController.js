import { PrestamoService } from '../services/PrestamoService.js';

const service = new PrestamoService();

export const listar = async (req, res) => {
  try {
    res.json(await service.listar());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    res.json(await service.buscarPorId(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const listarPorUsuario = async (req, res) => {
  try {
    res.json(await service.listarPorUsuario(req.params.usuarioId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const realizar = async (req, res) => {
  try {
    const { usuarioId, libroId, dias } = req.body;
    const resultado = await service.realizar(usuarioId, libroId, dias);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const devolver = async (req, res) => {
  try {
    res.json(await service.devolver(req.params.id));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
