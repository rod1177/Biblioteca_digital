export class NotificacionObserver {
  static suscriptores = [];

  static suscribir(fn) {
    this.suscriptores.push(fn);
  }

  static notificar(evento, datos) {
    console.log(`📢 Evento: ${evento}`, datos);
    this.suscriptores.forEach(fn => fn(evento, datos));
  }
}