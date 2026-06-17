import { MultaService } from '../services/MultaService.js';

const service = new MultaService();

export const listar = async (req, res) => {
  try {
    const multas = await service.listar();
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarPendientes = async (req, res) => {
  try {
    const multas = await service.listarPendientes();
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarPorUsuario = async (req, res) => {
  try {
    const multas = await service.listarPorUsuario(req.params.usuarioId);
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pagar = async (req, res) => {
  try {
    const multa = await service.pagar(req.params.id);
    res.json(multa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};