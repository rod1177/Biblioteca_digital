import { NotificacionObserver } from '../../src/patterns/observer/NotificacionObserver.js';

describe('NotificacionObserver - Patrón Observer', () => {

  beforeEach(() => {
    NotificacionObserver.suscriptores = [];
  });

  test('suscribe un observador correctamente', () => {
    const fn = jest.fn();
    NotificacionObserver.suscribir(fn);
    expect(NotificacionObserver.suscriptores).toHaveLength(1);
  });

  test('notifica a todos los suscriptores', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    NotificacionObserver.suscribir(fn1);
    NotificacionObserver.suscribir(fn2);
    NotificacionObserver.notificar('PRESTAMO_REALIZADO', { libroId: 1 });
    expect(fn1).toHaveBeenCalledWith('PRESTAMO_REALIZADO', { libroId: 1 });
    expect(fn2).toHaveBeenCalledWith('PRESTAMO_REALIZADO', { libroId: 1 });
  });

  test('sin suscriptores no lanza error', () => {
    expect(() =>
      NotificacionObserver.notificar('EVENTO', {})
    ).not.toThrow();
  });

  test('suscribe múltiples observadores', () => {
    NotificacionObserver.suscribir(jest.fn());
    NotificacionObserver.suscribir(jest.fn());
    NotificacionObserver.suscribir(jest.fn());
    expect(NotificacionObserver.suscriptores).toHaveLength(3);
  });
});