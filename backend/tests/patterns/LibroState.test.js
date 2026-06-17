import { DisponibleState } from '../../src/patterns/state/DisponibleState.js';
import { PrestadoState } from '../../src/patterns/state/PrestadoState.js';
import { ReservadoState } from '../../src/patterns/state/ReservadoState.js';

describe('LibroState - Patrón State', () => {

  describe('DisponibleState', () => {
    test('libro disponible puede prestarse', () => {
      const libro = { estado: 'disponible', state: null };
      const state = new DisponibleState();
      expect(state.prestar(libro)).toBe(true);
      expect(libro.estado).toBe('prestado');
      expect(libro.state).toBeInstanceOf(PrestadoState);
    });

    test('libro disponible puede reservarse', () => {
      const libro = { estado: 'disponible', state: null };
      const state = new DisponibleState();
      expect(state.reservar(libro)).toBe(true);
      expect(libro.estado).toBe('reservado');
      expect(libro.state).toBeInstanceOf(ReservadoState);
    });

    test('libro disponible no puede devolverse', () => {
      const state = new DisponibleState();
      expect(() => state.devolver({})).toThrow('El libro no está prestado');
    });

    test('getEstado retorna disponible', () => {
      const state = new DisponibleState();
      expect(state.getEstado()).toBe('disponible');
    });
  });

  describe('PrestadoState', () => {
    test('libro prestado no puede prestarse de nuevo', () => {
      const state = new PrestadoState();
      expect(() => state.prestar({})).toThrow('El libro ya está prestado');
    });

    test('libro prestado no puede reservarse', () => {
      const state = new PrestadoState();
      expect(() => state.reservar({})).toThrow('No se puede reservar un libro prestado');
    });

    test('libro prestado puede devolverse', () => {
      const libro = { estado: 'prestado', state: null };
      const state = new PrestadoState();
      expect(state.devolver(libro)).toBe(true);
      expect(libro.estado).toBe('disponible');
      expect(libro.state).toBeInstanceOf(DisponibleState);
    });

    test('getEstado retorna prestado', () => {
      const state = new PrestadoState();
      expect(state.getEstado()).toBe('prestado');
    });
  });

  describe('ReservadoState', () => {
    test('libro reservado puede prestarse', () => {
      const libro = { estado: 'reservado', state: null };
      const state = new ReservadoState();
      expect(state.prestar(libro)).toBe(true);
      expect(libro.estado).toBe('prestado');
      expect(libro.state).toBeInstanceOf(PrestadoState);
    });

    test('libro reservado no puede reservarse de nuevo', () => {
      const state = new ReservadoState();
      expect(() => state.reservar({})).toThrow('El libro ya está reservado');
    });

    test('libro reservado puede devolverse', () => {
      const libro = { estado: 'reservado', state: null };
      const state = new ReservadoState();
      expect(state.devolver(libro)).toBe(true);
      expect(libro.estado).toBe('disponible');
      expect(libro.state).toBeInstanceOf(DisponibleState);
    });

    test('getEstado retorna reservado', () => {
      const state = new ReservadoState();
      expect(state.getEstado()).toBe('reservado');
    });
  });

  describe('Transiciones de estado completas', () => {
    test('flujo completo: disponible -> prestado -> disponible', () => {
      const libro = { estado: 'disponible', state: new DisponibleState() };
      libro.state.prestar(libro);
      expect(libro.estado).toBe('prestado');
      libro.state.devolver(libro);
      expect(libro.estado).toBe('disponible');
    });

    test('flujo completo: disponible -> reservado -> prestado -> disponible', () => {
      const libro = { estado: 'disponible', state: new DisponibleState() };
      libro.state.reservar(libro);
      expect(libro.estado).toBe('reservado');
      libro.state.prestar(libro);
      expect(libro.estado).toBe('prestado');
      libro.state.devolver(libro);
      expect(libro.estado).toBe('disponible');
    });
  });
});