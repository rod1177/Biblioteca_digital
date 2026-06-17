import { UsuarioService } from '../services/UsuarioService.js';

const service = new UsuarioService();

export const registrar = async (req, res) => {
  try {
    const usuario = await service.registrar(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await service.login(email, password);
    res.json(resultado);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const usuarios = await service.listar();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const usuario = await service.buscarPorId(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const usuario = await service.actualizar(req.params.id, req.body);
    res.json(usuario);
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