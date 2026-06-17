import { Multa, Usuario, Prestamo, Libro } from '../models/index.js';
import { MultaEstudianteStrategy } from '../patterns/strategy/MultaEstudianteStrategy.js';
import { MultaProfesorStrategy } from '../patterns/strategy/MultaProfesorStrategy.js';

export class MultaService {

  // Calcula multa según rol del usuario (Strategy)
  calcularMonto(diasRetraso, rol) {
    const strategy = rol === 'profesor'
      ? new MultaProfesorStrategy()
      : new MultaEstudianteStrategy();
    return strategy.calcular(diasRetraso);
  }

  async listar() {
    return await Multa.findAll({
      include: [
        { model: Usuario, attributes: { exclude: ['password'] } },
        { model: Prestamo, include: [{ model: Libro }] }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async listarPorUsuario(usuarioId) {
    return await Multa.findAll({
      where: { usuarioId },
      include: [{ model: Prestamo, include: [{ model: Libro }] }]
    });
  }

  async listarPendientes() {
    return await Multa.findAll({
      where: { pagada: false },
      include: [
        { model: Usuario, attributes: { exclude: ['password'] } },
        { model: Prestamo, include: [{ model: Libro }] }
      ]
    });
  }

  async pagar(id) {
    const multa = await Multa.findByPk(id);
    if (!multa) throw new Error('Multa no encontrada');
    if (multa.pagada) throw new Error('La multa ya fue pagada');

    await multa.update({
      pagada: true,
      fechaPago: new Date().toISOString().split('T')[0]
    });
    return multa;
  }
}