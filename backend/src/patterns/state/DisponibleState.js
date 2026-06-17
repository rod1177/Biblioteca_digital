import { LibroState } from './LibroState.js';
import { PrestadoState } from './PrestadoState.js';
import { ReservadoState } from './ReservadoState.js';

export class DisponibleState extends LibroState {
  prestar(libro) {
    libro.estado = 'prestado';
    libro.state = new PrestadoState();
    return true;
  }
  reservar(libro) {
    libro.estado = 'reservado';
    libro.state = new ReservadoState();
    return true;
  }
  devolver() {
    throw new Error('El libro no está prestado');
  }
  getEstado() {
    return 'disponible';
  }
}