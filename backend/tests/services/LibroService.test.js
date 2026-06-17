import { LibroService } from '../../src/services/LibroService.js';
import { Libro, Autor } from '../../src/models/index.js';

jest.mock('../../src/models/index.js', () => ({
  Libro: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Autor: {}
}));

describe('LibroService', () => {
  const service = new LibroService();

  beforeEach(() => jest.clearAllMocks());

  describe('listar', () => {
    test('retorna lista de libros', async () => {
      const librosMock = [
        { id: 1, titulo: 'Clean Code', estado: 'disponible' },
        { id: 2, titulo: 'The Pragmatic Programmer', estado: 'prestado' }
      ];
      Libro.findAll.mockResolvedValue(librosMock);
      const resultado = await service.listar();
      expect(resultado).toHaveLength(2);
      expect(Libro.findAll).toHaveBeenCalledTimes(1);
    });

    test('retorna lista vacía si no hay libros', async () => {
      Libro.findAll.mockResolvedValue([]);
      const resultado = await service.listar();
      expect(resultado).toHaveLength(0);
    });
  });

  describe('buscarPorId', () => {
    test('retorna libro existente', async () => {
      const libroMock = { id: 1, titulo: 'Clean Code' };
      Libro.findByPk.mockResolvedValue(libroMock);
      const resultado = await service.buscarPorId(1);
      expect(resultado.titulo).toBe('Clean Code');
    });

    test('lanza error si libro no existe', async () => {
      Libro.findByPk.mockResolvedValue(null);
      await expect(service.buscarPorId(999))
        .rejects.toThrow('Libro no encontrado');
    });
  });

  describe('crear', () => {
    test('crea un libro correctamente', async () => {
      const libroMock = { id: 1, titulo: 'Nuevo Libro', stock: 3 };
      Libro.create.mockResolvedValue(libroMock);
      const resultado = await service.crear({
        titulo: 'Nuevo Libro', stock: 3
      });
      expect(resultado.titulo).toBe('Nuevo Libro');
      expect(Libro.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('actualizar', () => {
    test('actualiza un libro correctamente', async () => {
      const libroMock = {
        id: 1,
        titulo: 'Viejo Título',
        update: jest.fn().mockResolvedValue(true)
      };
      Libro.findByPk.mockResolvedValue(libroMock);
      await service.actualizar(1, { titulo: 'Nuevo Título' });
      expect(libroMock.update).toHaveBeenCalledWith({ titulo: 'Nuevo Título' });
    });
  });

  describe('eliminar', () => {
    test('elimina un libro correctamente', async () => {
      const libroMock = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };
      Libro.findByPk.mockResolvedValue(libroMock);
      const resultado = await service.eliminar(1);
      expect(libroMock.destroy).toHaveBeenCalledTimes(1);
      expect(resultado.mensaje).toBe('Libro eliminado correctamente');
    });
  });
});