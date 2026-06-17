// Interfaz base del patrón Strategy
export class MultaStrategy {
  calcular(diasRetraso) {
    throw new Error('calcular() debe implementarse');
  }
}