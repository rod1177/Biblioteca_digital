import { registrar, login, listar, buscarPorId, actualizar, eliminar } from '../../src/controllers/usuarioController.js';
import { UsuarioService } from '../../src/services/UsuarioService.js';

jest.mock('../../src/services/UsuarioService.js', () => {
  const instance = {
    registrar: jest.fn(),
    login: jest.fn(),
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    actualizar: jest.fn(),
    eliminar: jest.fn()
  };
  return { UsuarioService: jest.fn().mockImplementation(() => instance) };
});

describe('UsuarioController', () => {
  let req, res, service;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    service = new UsuarioService();
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    test('registra usuario y retorna 201', async () => {
      req.body = { nombre: 'Juan', email: 'juan@test.com', password: '1234' };
      const usuarioMock = { id: 1, nombre: 'Juan' };
      service.registrar.mockResolvedValue(usuarioMock);
      await registrar(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(usuarioMock);
    });

    test('retorna 400 si email ya existe', async () => {
      service.registrar.mockRejectedValue(new Error('El email ya está registrado'));
      await registrar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El email ya está registrado' });
    });
  });

  describe('login', () => {
    test('login exitoso retorna usuario y token', async () => {
      req.body = { email: 'juan@test.com', password: '1234' };
      const resultadoMock = { usuario: { id: 1 }, token: 'fake-token' };
      service.login.mockResolvedValue(resultadoMock);
      await login(req, res);
      expect(service.login).toHaveBeenCalledWith('juan@test.com', '1234');
      expect(res.json).toHaveBeenCalledWith(resultadoMock);
    });

    test('retorna 401 si credenciales incorrectas', async () => {
      req.body = { email: 'x@x.com', password: 'wrong' };
      service.login.mockRejectedValue(new Error('Credenciales incorrectas'));
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciales incorrectas' });
    });
  });

  describe('listar', () => {
    test('retorna lista de usuarios', async () => {
      const usuariosMock = [{ id: 1, nombre: 'Juan' }];
      service.listar.mockResolvedValue(usuariosMock);
      await listar(req, res);
      expect(res.json).toHaveBeenCalledWith(usuariosMock);
    });

    test('retorna 500 si hay error', async () => {
      service.listar.mockRejectedValue(new Error('DB error'));
      await listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('buscarPorId', () => {
    test('retorna usuario por id', async () => {
      req.params.id = '1';
      const usuarioMock = { id: 1, nombre: 'Juan' };
      service.buscarPorId.mockResolvedValue(usuarioMock);
      await buscarPorId(req, res);
      expect(res.json).toHaveBeenCalledWith(usuarioMock);
    });

    test('retorna 404 si no existe', async () => {
      req.params.id = '999';
      service.buscarPorId.mockRejectedValue(new Error('Usuario no encontrado'));
      await buscarPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizar', () => {
    test('actualiza usuario correctamente', async () => {
      req.params.id = '1';
      req.body = { nombre: 'Actualizado' };
      const usuarioMock = { id: 1, nombre: 'Actualizado' };
      service.actualizar.mockResolvedValue(usuarioMock);
      await actualizar(req, res);
      expect(res.json).toHaveBeenCalledWith(usuarioMock);
    });

    test('retorna 400 si hay error', async () => {
      service.actualizar.mockRejectedValue(new Error('Error al actualizar'));
      await actualizar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('eliminar', () => {
    test('desactiva usuario correctamente', async () => {
      req.params.id = '1';
      service.eliminar.mockResolvedValue({ mensaje: 'Usuario desactivado correctamente' });
      await eliminar(req, res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario desactivado correctamente' });
    });

    test('retorna 404 si no existe', async () => {
      req.params.id = '999';
      service.eliminar.mockRejectedValue(new Error('Usuario no encontrado'));
      await eliminar(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});