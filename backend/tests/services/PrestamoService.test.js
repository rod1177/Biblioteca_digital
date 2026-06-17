import { PrestamoService } from '../../src/services/PrestamoService.js';
import { Prestamo, Libro, Usuario } from '../../src/models/index.js';

jest.mock('../../src/models/index.js', () => ({
  Prestamo: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  },
  Libro: {},
  Usuario: {}
}));

jest.mock('../../src/patterns/facade/PrestamoFacade.js', () => ({
  PrestamoFacade: jest.fn().mockImplementation(() => ({
    realizarPrestamo: jest.fn().mockResolvedValue({
      id: 1, usuarioId: 1, libroId: 1, estado: 'activo'
    }),
    realizarDevolucion: jest.fn().mockResolvedValue({
      prestamo: { id: 1, estado: 'devuelto' },
      multa: null
    })
  }))
}));

describe('PrestamoService', () => {
  const service = new PrestamoService();

  beforeEach(() => jest.clearAllMocks());

  describe('listar', () => {
    test('retorna lista de préstamos', async () => {
      Prestamo.findAll.mockResolvedValue([
        { id: 1, estado: 'activo' },
        { id: 2, estado: 'devuelto' }
      ]);
      const resultado = await service.listar();
      expect(resultado).toHaveLength(2);
    });

    test('retorna lista vacía si no hay préstamos', async () => {
      Prestamo.findAll.mockResolvedValue([]);
      const resultado = await service.listar();
      expect(resultado).toHaveLength(0);
    });
  });

  describe('buscarPorId', () => {
    test('retorna préstamo existente', async () => {
      Prestamo.findByPk.mockResolvedValue({ id: 1, estado: 'activo' });
      const resultado = await service.buscarPorId(1);
      expect(resultado.id).toBe(1);
    });

    test('lanza error si préstamo no existe', async () => {
      Prestamo.findByPk.mockResolvedValue(null);
      await expect(service.buscarPorId(999))
        .rejects.toThrow('Préstamo no encontrado');
    });
  });

  describe('listarPorUsuario', () => {
    test('retorna préstamos del usuario', async () => {
      Prestamo.findAll.mockResolvedValue([
        { id: 1, usuarioId: 1 }
      ]);
      const resultado = await service.listarPorUsuario(1);
      expect(resultado).toHaveLength(1);
    });
  });

  describe('realizar', () => {
    test('realiza préstamo correctamente via Facade', async () => {
      const resultado = await service.realizar(1, 1);
      expect(resultado.estado).toBe('activo');
    });
  });

  describe('devolver', () => {
    test('realiza devolución correctamente via Facade', async () => {
      const resultado = await service.devolver(1);
      expect(resultado.prestamo.estado).toBe('devuelto');
      expect(resultado.multa).toBeNull();
    });
  });
});