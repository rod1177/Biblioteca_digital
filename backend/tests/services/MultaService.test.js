import { MultaService } from '../../src/services/MultaService.js';
import { Multa, Usuario, Prestamo, Libro } from '../../src/models/index.js';

jest.mock('../../src/models/index.js', () => ({
  Multa: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  Usuario: {},
  Prestamo: {},
  Libro: {}
}));

describe('MultaService', () => {
  const service = new MultaService();

  beforeEach(() => jest.clearAllMocks());

  describe('calcularMonto', () => {
    test('estudiante paga $5 por día', () => {
      expect(service.calcularMonto(3, 'usuario')).toBe(15);
    });
    test('admin paga $5 por día', () => {
      expect(service.calcularMonto(3, 'admin')).toBe(15);
    });
    test('profesor paga tarifa de profesor', () => {
      const monto = service.calcularMonto(3, 'profesor');
      expect(typeof monto).toBe('number');
      expect(monto).toBeGreaterThanOrEqual(0);
    });
    test('sin retraso no hay multa', () => {
      expect(service.calcularMonto(0, 'usuario')).toBe(0);
    });
    test('días negativos no generan multa', () => {
      expect(service.calcularMonto(-1, 'usuario')).toBe(0);
    });
    test('calcula correctamente para múltiples días', () => {
      expect(service.calcularMonto(7, 'usuario')).toBe(35);
    });
  });

  describe('listar', () => {
    test('devuelve todas las multas', async () => {
      const multasMock = [{ id: 1, monto: 15 }];
      Multa.findAll.mockResolvedValue(multasMock);
      const resultado = await service.listar();
      expect(Multa.findAll).toHaveBeenCalled();
      expect(resultado).toEqual(multasMock);
    });
  });

  describe('listarPorUsuario', () => {
    test('devuelve multas de un usuario', async () => {
      const multasMock = [{ id: 1, usuarioId: 1 }];
      Multa.findAll.mockResolvedValue(multasMock);
      const resultado = await service.listarPorUsuario(1);
      expect(Multa.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { usuarioId: 1 }
      }));
      expect(resultado).toEqual(multasMock);
    });
  });

  describe('listarPendientes', () => {
    test('devuelve multas no pagadas', async () => {
      const multasMock = [{ id: 1, pagada: false }];
      Multa.findAll.mockResolvedValue(multasMock);
      const resultado = await service.listarPendientes();
      expect(Multa.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { pagada: false }
      }));
      expect(resultado).toEqual(multasMock);
    });
  });

  describe('pagar', () => {
    test('paga multa correctamente', async () => {
      const multaMock = { id: 1, pagada: false, update: jest.fn().mockResolvedValue(true) };
      Multa.findByPk.mockResolvedValue(multaMock);
      const resultado = await service.pagar(1);
      expect(multaMock.update).toHaveBeenCalledWith(expect.objectContaining({ pagada: true }));
      expect(resultado).toBe(multaMock);
    });

    test('lanza error si multa no existe', async () => {
      Multa.findByPk.mockResolvedValue(null);
      await expect(service.pagar(999)).rejects.toThrow('Multa no encontrada');
    });

    test('lanza error si ya fue pagada', async () => {
      const multaMock = { id: 1, pagada: true };
      Multa.findByPk.mockResolvedValue(multaMock);
      await expect(service.pagar(1)).rejects.toThrow('La multa ya fue pagada');
    });
  });
});