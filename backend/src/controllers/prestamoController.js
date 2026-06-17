import { PrestamoService } from '../services/PrestamoService.js';

const service = new PrestamoService();

export const listar = async (req, res) => {
  try {
    const prestamos = await service.listar();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const prestamo = await service.buscarPorId(req.params.id);
    res.json(prestamo);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const listarPorUsuario = async (req, res) => {
  try {
    const prestamos = await service.listarPorUsuario(req.params.usuarioId);
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const realizar = async (req, res) => {
  try {
    const { usuarioId, libroId } = req.body;
    const prestamo = await service.realizar(usuarioId, libroId);
    res.status(201).json(prestamo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const devolver = async (req, res) => {
  try {
    const resultado = await service.devolver(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};