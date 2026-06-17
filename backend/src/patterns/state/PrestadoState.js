import { LibroState } from './LibroState.js';
import { DisponibleState } from './DisponibleState.js';

export class PrestadoState extends LibroState {
  prestar() {
    throw new Error('El libro ya está prestado');
  }
  reservar() {
    throw new Error('No se puede reservar un libro prestado');
  }
  devolver(libro) {
    libro.estado = 'disponible';
    libro.state = new DisponibleState();
    return true;
  }
  getEstado() {
    return 'prestado';
  }
}