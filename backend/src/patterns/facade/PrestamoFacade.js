import { Libro, Prestamo, Multa, Usuario } from '../../models/index.js';
import { MultaEstudianteStrategy } from '../strategy/MultaEstudianteStrategy.js';
import { MultaProfesorStrategy } from '../strategy/MultaProfesorStrategy.js';
import { NotificacionObserver } from '../observer/NotificacionObserver.js';

export class PrestamoFacade {

  async realizarPrestamo(usuarioId, libroId, dias = 15) {
    const diasPlazo = Math.min(Math.max(parseInt(dias) || 15, 1), 15);

    const libro = await Libro.findByPk(libroId);
    if (!libro) throw new Error('Libro no encontrado');
    if (libro.stock <= 0) throw new Error('No hay ejemplares disponibles');

    const fechaPrestamo = new Date();
    const fechaLimite   = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + diasPlazo);

    const prestamo = await Prestamo.create({
      usuarioId,
      libroId,
      fechaPrestamo: fechaPrestamo.toISOString().split('T')[0],
      fechaLimite:   fechaLimite.toISOString().split('T')[0],
      estado: 'activo'
    });

    const nuevoStock = libro.stock - 1;
    await libro.update({
      stock:  nuevoStock,
      estado: nuevoStock === 0 ? 'prestado' : 'disponible'
    });

    NotificacionObserver.notificar('PRESTAMO_REALIZADO', {
      usuarioId, libroId, prestamoId: prestamo.id,
      fechaLimite: fechaLimite.toISOString().split('T')[0], diasPlazo
    });

    return { prestamo, fechaLimite: fechaLimite.toISOString().split('T')[0], diasPlazo };
  }

  async realizarDevolucion(prestamoId) {
    const prestamo = await Prestamo.findByPk(prestamoId, {
      include: [{ model: Usuario }, { model: Libro }]
    });
    if (!prestamo) throw new Error('Préstamo no encontrado');
    if (prestamo.estado === 'devuelto') throw new Error('Este préstamo ya fue devuelto');

    const hoy = new Date();
    const fechaLimite = new Date(prestamo.fechaLimite);
    const diasRetraso = Math.max(
      0,
      Math.floor((hoy - fechaLimite) / (1000 * 60 * 60 * 24))
    );

    // Calcular multa con Strategy según rol del usuario
    let multa = null;
    if (diasRetraso > 0) {
      const strategy = prestamo.Usuario.rol === 'profesor'
        ? new MultaProfesorStrategy()
        : new MultaEstudianteStrategy();

      multa = await Multa.create({
        prestamoId,
        usuarioId: prestamo.usuarioId,
        monto:     strategy.calcular(diasRetraso),
        diasRetraso,
        pagada: false
      });
    }

    // Marcar préstamo como devuelto
    await prestamo.update({
      estado: 'devuelto',
      fechaDevolucion: hoy.toISOString().split('T')[0]
    });

    // Recargar libro desde BD para tener stock actualizado
    const libro = await Libro.findByPk(prestamo.libroId);
    const nuevoStock = libro.stock + 1;
    await libro.update({
      stock:  nuevoStock,
      estado: 'disponible'
    });

    NotificacionObserver.notificar('DEVOLUCION_REALIZADA', {
      prestamoId, diasRetraso, multa: multa?.monto || 0
    });

    return { prestamo, multa };
  }
}
