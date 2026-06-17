import { MultaStrategy } from './MultaStrategy.js';

export class MultaProfesorStrategy extends MultaStrategy {
  calcular(diasRetraso) {
    if (diasRetraso <= 0) return 0;
    return diasRetraso * 2; // $2 por día
  }
}