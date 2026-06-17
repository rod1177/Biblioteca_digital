import { listar, listarPendientes, listarPorUsuario, pagar } from '../../src/controllers/multaController.js';
import { MultaService } from '../../src/services/MultaService.js';

jest.mock('../../src/services/MultaService.js', () => {
  const instance = {
    listar: jest.fn(),
    listarPendientes: jest.fn(),
    listarPorUsuario: jest.fn(),
    pagar: jest.fn()
  };
  return { MultaService: jest.fn().mockImplementation(() => instance) };
});

describe('MultaController', () => {
  let req, res, service;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    service = new MultaService();
    jest.clearAllMocks();
  });

  describe('listar', () => {
    test('retorna todas las multas', async () => {
      const multasMock = [{ id: 1, monto: 15 }];
      service.listar.mockResolvedValue(multasMock);
      await listar(req, res);
      expect(res.json).toHaveBeenCalledWith(multasMock);
    });

    test('retorna 500 si hay error', async () => {
      service.listar.mockRejectedValue(new Error('DB error'));
      await listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('listarPendientes', () => {
    test('retorna multas pendientes', async () => {
      const multasMock = [{ id: 1, monto: 10, pagada: false }];
      service.listarPendientes.mockResolvedValue(multasMock);
      await listarPendientes(req, res);
      expect(res.json).toHaveBeenCalledWith(multasMock);
    });

    test('retorna 500 si hay error', async () => {
      service.listarPendientes.mockRejectedValue(new Error('Error'));
      await listarPendientes(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('listarPorUsuario', () => {
    test('retorna multas de un usuario', async () => {
      req.params.usuarioId = '1';
      const multasMock = [{ id: 1, monto: 5 }];
      service.listarPorUsuario.mockResolvedValue(multasMock);
      await listarPorUsuario(req, res);
      expect(service.listarPorUsuario).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(multasMock);
    });

    test('retorna 500 si hay error', async () => {
      req.params.usuarioId = '999';
      service.listarPorUsuario.mockRejectedValue(new Error('Error'));
      await listarPorUsuario(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('pagar', () => {
    test('paga la multa correctamente', async () => {
      req.params.id = '1';
      const multaMock = { id: 1, pagada: true };
      service.pagar.mockResolvedValue(multaMock);
      await pagar(req, res);
      expect(service.pagar).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(multaMock);
    });

    test('retorna 400 si ya fue pagada', async () => {
      req.params.id = '1';
      service.pagar.mockRejectedValue(new Error('La multa ya fue pagada'));
      await pagar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'La multa ya fue pagada' });
    });
  });
});