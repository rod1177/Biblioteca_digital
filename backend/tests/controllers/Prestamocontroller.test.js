import { listar, buscarPorId, listarPorUsuario, realizar, devolver } from '../../src/controllers/prestamoController.js';
import { PrestamoService } from '../../src/services/PrestamoService.js';

jest.mock('../../src/services/PrestamoService.js', () => {
  const instance = {
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    listarPorUsuario: jest.fn(),
    realizar: jest.fn(),
    devolver: jest.fn()
  };
  return { PrestamoService: jest.fn().mockImplementation(() => instance) };
});

describe('PrestamoController', () => {
  let req, res, service;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    service = new PrestamoService();
    jest.clearAllMocks();
  });

  describe('listar', () => {
    test('retorna lista de préstamos', async () => {
      const prestamosMock = [{ id: 1, estado: 'activo' }];
      service.listar.mockResolvedValue(prestamosMock);
      await listar(req, res);
      expect(res.json).toHaveBeenCalledWith(prestamosMock);
    });

    test('retorna 500 si hay error', async () => {
      service.listar.mockRejectedValue(new Error('DB error'));
      await listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('buscarPorId', () => {
    test('retorna préstamo por id', async () => {
      req.params.id = '1';
      const prestamoMock = { id: 1, estado: 'activo' };
      service.buscarPorId.mockResolvedValue(prestamoMock);
      await buscarPorId(req, res);
      expect(res.json).toHaveBeenCalledWith(prestamoMock);
    });

    test('retorna 404 si no existe', async () => {
      req.params.id = '999';
      service.buscarPorId.mockRejectedValue(new Error('Préstamo no encontrado'));
      await buscarPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('listarPorUsuario', () => {
    test('retorna préstamos del usuario', async () => {
      req.params.usuarioId = '1';
      const prestamosMock = [{ id: 1 }];
      service.listarPorUsuario.mockResolvedValue(prestamosMock);
      await listarPorUsuario(req, res);
      expect(service.listarPorUsuario).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(prestamosMock);
    });

    test('retorna 500 si hay error', async () => {
      service.listarPorUsuario.mockRejectedValue(new Error('Error'));
      await listarPorUsuario(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('realizar', () => {
    test('realiza préstamo y retorna 201', async () => {
      req.body = { usuarioId: 1, libroId: 2, dias: 7 };
      const resultadoMock = { prestamo: { id: 1 }, fechaLimite: '2025-01-01' };
      service.realizar.mockResolvedValue(resultadoMock);
      await realizar(req, res);
      expect(service.realizar).toHaveBeenCalledWith(1, 2, 7);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(resultadoMock);
    });

    test('retorna 400 si hay error', async () => {
      req.body = { usuarioId: 1, libroId: 2, dias: 7 };
      service.realizar.mockRejectedValue(new Error('Sin stock'));
      await realizar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Sin stock' });
    });
  });

  describe('devolver', () => {
    test('procesa devolución correctamente', async () => {
      req.params.id = '1';
      const resultadoMock = { prestamo: { id: 1, estado: 'devuelto' }, multa: null };
      service.devolver.mockResolvedValue(resultadoMock);
      await devolver(req, res);
      expect(res.json).toHaveBeenCalledWith(resultadoMock);
    });

    test('retorna 400 si ya fue devuelto', async () => {
      req.params.id = '1';
      service.devolver.mockRejectedValue(new Error('Este préstamo ya fue devuelto'));
      await devolver(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});