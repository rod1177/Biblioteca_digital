// Interfaz base del patrón State
export class LibroState {
  prestar(libro) {
    throw new Error('prestar() debe implementarse');
  }
  reservar(libro) {
    throw new Error('reservar() debe implementarse');
  }
  devolver(libro) {
    throw new Error('devolver() debe implementarse');
  }
  getEstado() {
    throw new Error('getEstado() debe implementarse');
  }
}