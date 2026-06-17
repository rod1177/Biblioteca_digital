import { MultaService } from '../../src/services/MultaService.js';

describe('MultaService', () => {
  const service = new MultaService();

  describe('calcularMonto', () => {
    test('usuario normal paga $5 por día', () => {
      expect(service.calcularMonto(3, 'usuario')).toBe(15);
    });

    test('admin paga $5 por día (mismo que usuario)', () => {
      expect(service.calcularMonto(3, 'admin')).toBe(15);
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
});