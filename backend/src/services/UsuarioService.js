import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export class UsuarioService {

  async registrar(datos) {
    const existe = await Usuario.findOne({ where: { email: datos.email } });
    if (existe) throw new Error('El email ya está registrado');

    const passwordHash = await bcrypt.hash(datos.password, 10);
    const usuario = await Usuario.create({
      ...datos,
      password: passwordHash
    });
    return usuario;
  }

  async login(email, password) {
    const usuario = await Usuario.findOne({ where: { email, activo: true } });
    if (!usuario) throw new Error('Credenciales incorrectas');

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) throw new Error('Credenciales incorrectas');

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    return { usuario, token };
  }

  async listar() {
    return await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async buscarPorId(id) {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }

  async actualizar(id, datos) {
    const usuario = await this.buscarPorId(id);
    if (datos.password) {
      datos.password = await bcrypt.hash(datos.password, 10);
    }
    await usuario.update(datos);
    return usuario;
  }

  async eliminar(id) {
    const usuario = await this.buscarPorId(id);
    await usuario.update({ activo: false });
    return { mensaje: 'Usuario desactivado correctamente' };
  }
}