import { MultaEstudianteStrategy } from '../../src/patterns/strategy/MultaEstudianteStrategy.js';
import { MultaProfesorStrategy } from '../../src/patterns/strategy/MultaProfesorStrategy.js';

describe('MultaStrategy - Patrón Strategy', () => {

  describe('MultaEstudianteStrategy', () => {
    const strategy = new MultaEstudianteStrategy();

    test('cobra $5 por día de retraso', () => {
      expect(strategy.calcular(1)).toBe(5);
    });

    test('cobra $15 por 3 días de retraso', () => {
      expect(strategy.calcular(3)).toBe(15);
    });

    test('sin retraso no genera multa', () => {
      expect(strategy.calcular(0)).toBe(0);
    });

    test('días negativos no generan multa', () => {
      expect(strategy.calcular(-2)).toBe(0);
    });

    test('cobra $50 por 10 días de retraso', () => {
      expect(strategy.calcular(10)).toBe(50);
    });
  });

  describe('MultaProfesorStrategy', () => {
    const strategy = new MultaProfesorStrategy();

    test('cobra $2 por día de retraso', () => {
      expect(strategy.calcular(1)).toBe(2);
    });

    test('cobra $6 por 3 días de retraso', () => {
      expect(strategy.calcular(3)).toBe(6);
    });

    test('sin retraso no genera multa', () => {
      expect(strategy.calcular(0)).toBe(0);
    });

    test('días negativos no generan multa', () => {
      expect(strategy.calcular(-1)).toBe(0);
    });

    test('cobra $20 por 10 días de retraso', () => {
      expect(strategy.calcular(10)).toBe(20);
    });
  });

  describe('Comparación entre estrategias', () => {
    test('estudiante paga más que profesor por el mismo retraso', () => {
      const estudiante = new MultaEstudianteStrategy();
      const profesor = new MultaProfesorStrategy();
      expect(estudiante.calcular(5)).toBeGreaterThan(profesor.calcular(5));
    });
  });
});
import { MultaStrategy } from '../../src/patterns/strategy/MultaStrategy.js';

describe('MultaStrategy - Clase base', () => {
  test('calcular() lanza error si no se implementa', () => {
    const strategy = new MultaStrategy();
    expect(() => strategy.calcular(3)).toThrow('calcular() debe implementarse');
  });
});