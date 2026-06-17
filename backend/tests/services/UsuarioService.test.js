import { UsuarioService } from '../../src/services/UsuarioService.js';
import { Usuario } from '../../src/models/index.js';

jest.mock('../../src/models/index.js', () => ({
  Usuario: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-token')
}));

import bcrypt from 'bcryptjs';

describe('UsuarioService', () => {
  const service = new UsuarioService();

  beforeEach(() => jest.clearAllMocks());

  describe('registrar', () => {
    test('registra un usuario nuevo correctamente', async () => {
      Usuario.findOne.mockResolvedValue(null);
      Usuario.create.mockResolvedValue({ id: 1, nombre: 'Juan', email: 'juan@test.com' });

      const resultado = await service.registrar({
        nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com', password: '12345'
      });

      expect(Usuario.findOne).toHaveBeenCalledWith({ where: { email: 'juan@test.com' } });
      expect(resultado.nombre).toBe('Juan');
    });

    test('lanza error si el email ya está registrado', async () => {
      Usuario.findOne.mockResolvedValue({ id: 1, email: 'juan@test.com' });
      await expect(service.registrar({ email: 'juan@test.com', password: '12345' }))
        .rejects.toThrow('El email ya está registrado');
    });
  });

  describe('login', () => {
    test('login exitoso devuelve usuario y token', async () => {
      const usuarioMock = { id: 1, email: 'juan@test.com', rol: 'usuario', password: 'hashedPassword' };
      Usuario.findOne.mockResolvedValue(usuarioMock);
      bcrypt.compare.mockResolvedValue(true);

      const resultado = await service.login('juan@test.com', '12345');
      expect(resultado.token).toBe('fake-token');
      expect(resultado.usuario.email).toBe('juan@test.com');
    });

    test('lanza error si el usuario no existe', async () => {
      Usuario.findOne.mockResolvedValue(null);
      await expect(service.login('noexiste@test.com', '12345'))
        .rejects.toThrow('Credenciales incorrectas');
    });

    test('lanza error si la contraseña es incorrecta', async () => {
      Usuario.findOne.mockResolvedValue({ id: 1, email: 'juan@test.com', password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(service.login('juan@test.com', 'wrongpassword'))
        .rejects.toThrow('Credenciales incorrectas');
    });
  });

  describe('listar', () => {
    test('devuelve todos los usuarios', async () => {
      const usuariosMock = [{ id: 1, nombre: 'Juan' }];
      Usuario.findAll.mockResolvedValue(usuariosMock);
      const resultado = await service.listar();
      expect(Usuario.findAll).toHaveBeenCalled();
      expect(resultado).toEqual(usuariosMock);
    });
  });

  describe('buscarPorId', () => {
    test('devuelve usuario existente', async () => {
      const usuarioMock = { id: 1, nombre: 'Juan' };
      Usuario.findByPk.mockResolvedValue(usuarioMock);
      const resultado = await service.buscarPorId(1);
      expect(resultado).toEqual(usuarioMock);
    });

    test('lanza error si no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);
      await expect(service.buscarPorId(999)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('actualizar', () => {
    test('actualiza usuario sin cambio de contraseña', async () => {
      const updateFn = jest.fn().mockResolvedValue(true);
      const usuarioMock = { id: 1, nombre: 'Juan', update: updateFn };
      Usuario.findByPk.mockResolvedValue(usuarioMock);

      const resultado = await service.actualizar(1, { nombre: 'Carlos' });
      expect(updateFn).toHaveBeenCalledWith({ nombre: 'Carlos' });
    });

    test('actualiza usuario con cambio de contraseña', async () => {
      const updateFn = jest.fn().mockResolvedValue(true);
      const usuarioMock = { id: 1, update: updateFn };
      Usuario.findByPk.mockResolvedValue(usuarioMock);

      await service.actualizar(1, { password: 'nueva123' });
      expect(bcrypt.hash).toHaveBeenCalledWith('nueva123', 10);
      expect(updateFn).toHaveBeenCalledWith({ password: 'hashedPassword' });
    });
  });

  describe('eliminar', () => {
    test('desactiva usuario correctamente', async () => {
      const updateFn = jest.fn().mockResolvedValue(true);
      const usuarioMock = { id: 1, update: updateFn };
      Usuario.findByPk.mockResolvedValue(usuarioMock);

      const resultado = await service.eliminar(1);
      expect(updateFn).toHaveBeenCalledWith({ activo: false });
      expect(resultado).toEqual({ mensaje: 'Usuario desactivado correctamente' });
    });

    test('lanza error si usuario no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);
      await expect(service.eliminar(999)).rejects.toThrow('Usuario no encontrado');
    });
  });
});