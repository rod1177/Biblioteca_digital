import { listar, crear, buscarPorId, eliminar } from '../../src/controllers/libroController.js';
import { LibroService } from '../../src/services/LibroService.js';

jest.mock('../../src/services/LibroService.js', () => ({
  LibroService: jest.fn().mockImplementation(() => ({
    listar: jest.fn(),
    crear: jest.fn(),
    buscarPorId: jest.fn(),
    eliminar: jest.fn(),
    listarDisponibles: jest.fn(),
    buscarPorTitulo: jest.fn()
  }))
}));

describe('LibroController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('listar', () => {
    test('retorna lista de libros con status 200', async () => {
      const librosMock = [{ id: 1, titulo: 'Clean Code' }];
      LibroService.mock.instances[0].listar.mockResolvedValue(librosMock);
      await listar(req, res);
      expect(res.json).toHaveBeenCalledWith(librosMock);
    });

    test('retorna 500 si hay error', async () => {
      LibroService.mock.instances[0].listar.mockRejectedValue(
        new Error('DB error')
      );
      await listar(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('crear', () => {
    test('crea libro y retorna 201', async () => {
      const libroMock = { id: 1, titulo: 'Nuevo' };
      req.body = { titulo: 'Nuevo', stock: 1 };
      LibroService.mock.instances[0].crear.mockResolvedValue(libroMock);
      await crear(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(libroMock);
    });

    test('retorna 400 si hay error de validación', async () => {
      LibroService.mock.instances[0].crear.mockRejectedValue(
        new Error('Validación fallida')
      );
      await crear(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('buscarPorId', () => {
    test('retorna libro por id', async () => {
      req.params.id = '1';
      const libroMock = { id: 1, titulo: 'Clean Code' };
      LibroService.mock.instances[0].buscarPorId.mockResolvedValue(libroMock);
      await buscarPorId(req, res);
      expect(res.json).toHaveBeenCalledWith(libroMock);
    });

    test('retorna 404 si no existe', async () => {
      req.params.id = '999';
      LibroService.mock.instances[0].buscarPorId.mockRejectedValue(
        new Error('Libro no encontrado')
      );
      await buscarPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminar', () => {
    test('elimina libro correctamente', async () => {
      req.params.id = '1';
      LibroService.mock.instances[0].eliminar.mockResolvedValue({
        mensaje: 'Libro eliminado correctamente'
      });
      await eliminar(req, res);
      expect(res.json).toHaveBeenCalledWith({
        mensaje: 'Libro eliminado correctamente'
      });
    });
  });
});