import { PrestamoFacade } from '../../src/patterns/facade/PrestamoFacade.js';
import { Libro, Prestamo, Multa, Usuario } from '../../src/models/index.js';
import { NotificacionObserver } from '../../src/patterns/observer/NotificacionObserver.js';

jest.mock('../../src/models/index.js', () => ({
  Libro: { findByPk: jest.fn() },
  Prestamo: { create: jest.fn(), findByPk: jest.fn() },
  Multa: { create: jest.fn() },
  Usuario: {}
}));

jest.mock('../../src/patterns/observer/NotificacionObserver.js', () => ({
  NotificacionObserver: { notificar: jest.fn(), suscribir: jest.fn(), suscriptores: [] }
}));

describe('PrestamoFacade', () => {
  const facade = new PrestamoFacade();

  beforeEach(() => jest.clearAllMocks());

  describe('realizarPrestamo', () => {
    test('crea préstamo correctamente cuando hay stock', async () => {
      const libroMock = { id: 1, stock: 3, update: jest.fn().mockResolvedValue(true) };
      Libro.findByPk.mockResolvedValue(libroMock);
      const prestamoMock = { id: 1 };
      Prestamo.create.mockResolvedValue(prestamoMock);

      const resultado = await facade.realizarPrestamo(1, 1, 7);

      expect(Prestamo.create).toHaveBeenCalled();
      expect(libroMock.update).toHaveBeenCalledWith(expect.objectContaining({ stock: 2 }));
      expect(NotificacionObserver.notificar).toHaveBeenCalledWith('PRESTAMO_REALIZADO', expect.any(Object));
      expect(resultado.prestamo).toEqual(prestamoMock);
    });

    test('establece estado "prestado" cuando stock llega a 0', async () => {
      const libroMock = { id: 1, stock: 1, update: jest.fn().mockResolvedValue(true) };
      Libro.findByPk.mockResolvedValue(libroMock);
      Prestamo.create.mockResolvedValue({ id: 1 });

      await facade.realizarPrestamo(1, 1, 7);

      expect(libroMock.update).toHaveBeenCalledWith(expect.objectContaining({
        stock: 0,
        estado: 'prestado'
      }));
    });

    test('lanza error si libro no existe', async () => {
      Libro.findByPk.mockResolvedValue(null);
      await expect(facade.realizarPrestamo(1, 999, 7)).rejects.toThrow('Libro no encontrado');
    });

    test('lanza error si no hay stock', async () => {
      Libro.findByPk.mockResolvedValue({ id: 1, stock: 0 });
      await expect(facade.realizarPrestamo(1, 1, 7)).rejects.toThrow('No hay ejemplares disponibles');
    });

    test('limita días al máximo de 15 si se pasa un número mayor', async () => {
      const libroMock = { id: 1, stock: 2, update: jest.fn().mockResolvedValue(true) };
      Libro.findByPk.mockResolvedValue(libroMock);
      Prestamo.create.mockResolvedValue({ id: 1 });

      const resultado = await facade.realizarPrestamo(1, 1, 100);
      expect(resultado.diasPlazo).toBe(15);
    });

    test('usa 15 días por defecto si días es 0 (falsy)', async () => {
      const libroMock = { id: 1, stock: 2, update: jest.fn().mockResolvedValue(true) };
      Libro.findByPk.mockResolvedValue(libroMock);
      Prestamo.create.mockResolvedValue({ id: 2 });

      // días=0 es falsy, entonces parseInt(0)||15 = 15
      const resultado = await facade.realizarPrestamo(1, 1, 0);
      expect(resultado.diasPlazo).toBe(15);
    });
  });

  describe('realizarDevolucion', () => {
    test('procesa devolución sin retraso correctamente', async () => {
      const hoy = new Date();
      const fechaFutura = new Date(hoy);
      fechaFutura.setDate(hoy.getDate() + 5);

      const libroMock = { id: 1, stock: 0, update: jest.fn().mockResolvedValue(true) };
      const prestamoMock = {
        id: 1,
        estado: 'activo',
        usuarioId: 1,
        libroId: 1,
        fechaLimite: fechaFutura.toISOString().split('T')[0],
        Usuario: { rol: 'usuario' },
        update: jest.fn().mockResolvedValue(true)
      };

      Prestamo.findByPk.mockResolvedValue(prestamoMock);
      Libro.findByPk.mockResolvedValue(libroMock);

      const resultado = await facade.realizarDevolucion(1);

      expect(prestamoMock.update).toHaveBeenCalledWith(expect.objectContaining({ estado: 'devuelto' }));
      expect(libroMock.update).toHaveBeenCalledWith(expect.objectContaining({ estado: 'disponible' }));
      expect(resultado.multa).toBeNull();
      expect(NotificacionObserver.notificar).toHaveBeenCalledWith('DEVOLUCION_REALIZADA', expect.any(Object));
    });

    test('genera multa si hay retraso para estudiante', async () => {
      const fechaPasada = new Date();
      fechaPasada.setDate(fechaPasada.getDate() - 5);

      const libroMock = { id: 1, stock: 0, update: jest.fn().mockResolvedValue(true) };
      const prestamoMock = {
        id: 1, estado: 'activo', usuarioId: 1, libroId: 1,
        fechaLimite: fechaPasada.toISOString().split('T')[0],
        Usuario: { rol: 'usuario' },
        update: jest.fn().mockResolvedValue(true)
      };
      const multaMock = { id: 1, monto: 25 };

      Prestamo.findByPk.mockResolvedValue(prestamoMock);
      Libro.findByPk.mockResolvedValue(libroMock);
      Multa.create.mockResolvedValue(multaMock);

      const resultado = await facade.realizarDevolucion(1);
      expect(Multa.create).toHaveBeenCalled();
      expect(resultado.multa).toEqual(multaMock);
    });

    test('genera multa si hay retraso para profesor', async () => {
      const fechaPasada = new Date();
      fechaPasada.setDate(fechaPasada.getDate() - 3);

      const libroMock = { id: 1, stock: 1, update: jest.fn().mockResolvedValue(true) };
      const prestamoMock = {
        id: 1, estado: 'activo', usuarioId: 2, libroId: 1,
        fechaLimite: fechaPasada.toISOString().split('T')[0],
        Usuario: { rol: 'profesor' },
        update: jest.fn().mockResolvedValue(true)
      };
      const multaMock = { id: 2, monto: 30 };

      Prestamo.findByPk.mockResolvedValue(prestamoMock);
      Libro.findByPk.mockResolvedValue(libroMock);
      Multa.create.mockResolvedValue(multaMock);

      const resultado = await facade.realizarDevolucion(1);
      expect(Multa.create).toHaveBeenCalled();
    });

    test('lanza error si préstamo no existe', async () => {
      Prestamo.findByPk.mockResolvedValue(null);
      await expect(facade.realizarDevolucion(999)).rejects.toThrow('Préstamo no encontrado');
    });

    test('lanza error si préstamo ya fue devuelto', async () => {
      Prestamo.findByPk.mockResolvedValue({ id: 1, estado: 'devuelto' });
      await expect(facade.realizarDevolucion(1)).rejects.toThrow('Este préstamo ya fue devuelto');
    });
  });
});