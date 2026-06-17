import { Prestamo, Libro, Usuario } from '../models/index.js';
import { PrestamoFacade } from '../patterns/facade/PrestamoFacade.js';

export class PrestamoService {
  constructor() {
    this.facade = new PrestamoFacade();
  }

  async listar() {
    return await Prestamo.findAll({
      include: [
        { model: Usuario, attributes: { exclude: ['password'] } },
        { model: Libro }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async buscarPorId(id) {
    const prestamo = await Prestamo.findByPk(id, {
      include: [
        { model: Usuario, attributes: { exclude: ['password'] } },
        { model: Libro }
      ]
    });
    if (!prestamo) throw new Error('Préstamo no encontrado');
    return prestamo;
  }

  async listarPorUsuario(usuarioId) {
    return await Prestamo.findAll({
      where: { usuarioId },
      include: [{ model: Libro }],
      order: [['createdAt', 'DESC']]
    });
  }

  async realizar(usuarioId, libroId, dias = 15) {
    return await this.facade.realizarPrestamo(usuarioId, libroId, dias);
  }

  async devolver(prestamoId) {
    return await this.facade.realizarDevolucion(prestamoId);
  }
}
