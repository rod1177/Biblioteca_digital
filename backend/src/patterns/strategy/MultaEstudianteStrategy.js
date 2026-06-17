import { MultaStrategy } from './MultaStrategy.js';

export class MultaEstudianteStrategy extends MultaStrategy {
  calcular(diasRetraso) {
    if (diasRetraso <= 0) return 0;
    return diasRetraso * 5; // $5 por día
  }
}