import { Libro, Autor } from '../models/index.js';

export class LibroService {

  async listar() {
    return await Libro.findAll({
      include: [{ model: Autor }],
      order: [['titulo', 'ASC']]
    });
  }

  async buscarPorId(id) {
    const libro = await Libro.findByPk(id, {
      include: [{ model: Autor }]
    });
    if (!libro) throw new Error('Libro no encontrado');
    return libro;
  }

  async buscarPorTitulo(titulo) {
    const { Op } = await import('sequelize');
    return await Libro.findAll({
      where: { titulo: { [Op.like]: `%${titulo}%` } },
      include: [{ model: Autor }]
    });
  }

  async crear(datos) {
    return await Libro.create(datos);
  }

  async actualizar(id, datos) {
    const libro = await this.buscarPorId(id);
    await libro.update(datos);
    return libro;
  }

  async eliminar(id) {
    const libro = await this.buscarPorId(id);
    await libro.destroy();
    return { mensaje: 'Libro eliminado correctamente' };
  }

  async listarDisponibles() {
    return await Libro.findAll({
      where: { estado: 'disponible' },
      include: [{ model: Autor }]
    });
  }
}