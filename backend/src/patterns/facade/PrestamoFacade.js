import { Libro, Prestamo, Multa, Usuario } from '../../models/index.js';
import { DisponibleState } from '../state/DisponibleState.js';
import { PrestadoState } from '../state/PrestadoState.js';
import { MultaEstudianteStrategy } from '../strategy/MultaEstudianteStrategy.js';
import { MultaProfesorStrategy } from '../strategy/MultaProfesorStrategy.js';
import { NotificacionObserver } from '../observer/NotificacionObserver.js';

export class PrestamoFacade {

  // Realiza el proceso completo de préstamo
 async realizarPrestamo(usuarioId, libroId) {
  const libro = await Libro.findByPk(libroId);
  if (!libro) throw new Error('Libro no encontrado');
  if (libro.stock <= 0) throw new Error('No hay ejemplares disponibles');

  // Calcular fecha límite (15 días)
  const fechaPrestamo = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + 15);

  // Crear préstamo
  const prestamo = await Prestamo.create({
    usuarioId,
    libroId,
    fechaPrestamo: fechaPrestamo.toISOString().split('T')[0],
    fechaLimite: fechaLimite.toISOString().split('T')[0],
    estado: 'activo'
  });

  // Reducir stock y cambiar estado solo si stock llega a 0
  const nuevoStock = libro.stock - 1;
  await libro.update({
    stock: nuevoStock,
    estado: nuevoStock === 0 ? 'prestado' : 'disponible'
  });

  NotificacionObserver.notificar('PRESTAMO_REALIZADO', {
    usuarioId, libroId, prestamoId: prestamo.id,
    fechaLimite: fechaLimite.toISOString().split('T')[0]
  });

  return { prestamo, fechaLimite: fechaLimite.toISOString().split('T')[0] };
}

  // Realiza la devolución y calcula multa si aplica
  async realizarDevolucion(prestamoId) {
    const prestamo = await Prestamo.findByPk(prestamoId, {
      include: [{ model: Usuario }, { model: Libro }]
    });
    if (!prestamo) throw new Error('Préstamo no encontrado');

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

      const monto = strategy.calcular(diasRetraso);

      multa = await Multa.create({
        prestamoId,
        usuarioId: prestamo.usuarioId,
        monto,
        diasRetraso,
        pagada: false
      });
    }

    // Actualizar préstamo y libro
    await prestamo.update({
      estado: 'devuelto',
      fechaDevolucion: hoy.toISOString().split('T')[0]
    });
    await prestamo.Libro.update({ estado: 'disponible' });

    // Notificar via Observer
    NotificacionObserver.notificar('DEVOLUCION_REALIZADA', {
      prestamoId, diasRetraso, multa: multa?.monto || 0
    });

    return { prestamo, multa };
  }
}