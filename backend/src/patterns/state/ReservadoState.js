import { LibroState } from './LibroState.js';
import { PrestadoState } from './PrestadoState.js';
import { DisponibleState } from './DisponibleState.js';

export class ReservadoState extends LibroState {
  prestar(libro) {
    libro.estado = 'prestado';
    libro.state = new PrestadoState();
    return true;
  }
  reservar() {
    throw new Error('El libro ya está reservado');
  }
  devolver(libro) {
    libro.estado = 'disponible';
    libro.state = new DisponibleState();
    return true;
  }
  getEstado() {
    return 'reservado';
  }
}