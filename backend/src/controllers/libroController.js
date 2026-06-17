import { LibroService } from '../services/LibroService.js';

const service = new LibroService();

export const listar = async (req, res) => {
  try {
    const libros = req.query.titulo
      ? await service.buscarPorTitulo(req.query.titulo)
      : await service.listar();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarDisponibles = async (req, res) => {
  try {
    const libros = await service.listarDisponibles();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const libro = await service.buscarPorId(req.params.id);
    res.json(libro);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const crear = async (req, res) => {
  try {
    const libro = await service.crear(req.body);
    res.status(201).json(libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const libro = await service.actualizar(req.params.id, req.body);
    res.json(libro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const resultado = await service.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};