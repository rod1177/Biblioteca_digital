import { listar, crear, buscarPorId, eliminar, listarDisponibles, actualizar } from '../../src/controllers/libroController.js';
import { LibroService } from '../../src/services/LibroService.js';

// Mock del servicio - debemos capturar la instancia manualmente
let mockServiceInstance;

jest.mock('../../src/services/LibroService.js', () => {
  const instance = {
    listar: jest.fn(),
    crear: jest.fn(),
    buscarPorId: jest.fn(),
    eliminar: jest.fn(),
    listarDisponibles: jest.fn(),
    buscarPorTitulo: jest.fn(),
    actualizar: jest.fn()
  };
  return {
    LibroService: jest.fn().mockImplementation(() => instance)
  };
});

describe('LibroController', () => {
  let req, res, serviceInstance;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    serviceInstance = new LibroService();
    jest.clearAllMocks();
  });

  describe('listar', () => {
    test('retorna lista de libros con status 200', async () => {
      const librosMock = [{ id: 1, titulo: 'Clean Code' }];
      serviceInstance.listar.mockResolvedValue(librosMock);
      await listar(req, res);
      expect(res.json).toHaveBeenCalledWith(librosMock);
    });

    test('busca por titulo si se pasa query.titulo', async () => {
      req.query.titulo = 'Clean';
      const librosMock = [{ id: 1, titulo: 'Clean Code' }];
      serviceInstance.buscarPorTitulo.mockResolvedValue(librosMock);
      await listar(req, res);
      expect(serviceInstance.buscarPorTitulo).toHaveBeenCalledWith('Clean');
      expect(res.json).toHaveBeenCalledWith(librosMock);
    });

    test('retorna 500 si hay error', async () => {
      serviceInstance.listar.mockRejectedValue(new Error('DB error'));
      await listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('listarDisponibles', () => {
    test('retorna libros disponibles', async () => {
      const librosMock = [{ id: 1, titulo: 'Disponible' }];
      serviceInstance.listarDisponibles.mockResolvedValue(librosMock);
      await listarDisponibles(req, res);
      expect(res.json).toHaveBeenCalledWith(librosMock);
    });

    test('retorna 500 si hay error', async () => {
      serviceInstance.listarDisponibles.mockRejectedValue(new Error('Error'));
      await listarDisponibles(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('crear', () => {
    test('crea libro y retorna 201', async () => {
      const libroMock = { id: 1, titulo: 'Nuevo' };
      req.body = { titulo: 'Nuevo', stock: 1 };
      serviceInstance.crear.mockResolvedValue(libroMock);
      await crear(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(libroMock);
    });

    test('retorna 400 si hay error de validación', async () => {
      serviceInstance.crear.mockRejectedValue(new Error('Validación fallida'));
      await crear(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validación fallida' });
    });
  });

  describe('buscarPorId', () => {
    test('retorna libro por id', async () => {
      req.params.id = '1';
      const libroMock = { id: 1, titulo: 'Clean Code' };
      serviceInstance.buscarPorId.mockResolvedValue(libroMock);
      await buscarPorId(req, res);
      expect(res.json).toHaveBeenCalledWith(libroMock);
    });

    test('retorna 404 si no existe', async () => {
      req.params.id = '999';
      serviceInstance.buscarPorId.mockRejectedValue(new Error('Libro no encontrado'));
      await buscarPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Libro no encontrado' });
    });
  });

  describe('actualizar', () => {
    test('actualiza libro y retorna 200', async () => {
      req.params.id = '1';
      req.body = { titulo: 'Actualizado' };
      const libroMock = { id: 1, titulo: 'Actualizado' };
      serviceInstance.actualizar.mockResolvedValue(libroMock);
      await actualizar(req, res);
      expect(res.json).toHaveBeenCalledWith(libroMock);
    });

    test('retorna 400 si hay error', async () => {
      serviceInstance.actualizar.mockRejectedValue(new Error('Error al actualizar'));
      await actualizar(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('eliminar', () => {
    test('elimina libro correctamente', async () => {
      req.params.id = '1';
      serviceInstance.eliminar.mockResolvedValue({ mensaje: 'Libro eliminado correctamente' });
      await eliminar(req, res);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Libro eliminado correctamente' });
    });

    test('retorna 404 si no existe', async () => {
      req.params.id = '999';
      serviceInstance.eliminar.mockRejectedValue(new Error('Libro no encontrado'));
      await eliminar(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});