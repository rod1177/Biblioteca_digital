import { UsuarioService } from '../../src/services/UsuarioService.js';
import { Usuario } from '../../src/models/index.js';

// Mock del modelo Usuario
jest.mock('../../src/models/index.js', () => ({
  Usuario: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

// Mock de bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-token')
}));

import bcrypt from 'bcryptjs';

describe('UsuarioService', () => {
  const service = new UsuarioService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    test('registra un usuario nuevo correctamente', async () => {
      Usuario.findOne.mockResolvedValue(null);
      Usuario.create.mockResolvedValue({
        id: 1, nombre: 'Juan', email: 'juan@test.com'
      });

      const resultado = await service.registrar({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        password: '12345'
      });

      expect(Usuario.findOne).toHaveBeenCalledWith({
        where: { email: 'juan@test.com' }
      });
      expect(resultado.nombre).toBe('Juan');
    });

    test('lanza error si el email ya está registrado', async () => {
      Usuario.findOne.mockResolvedValue({ id: 1, email: 'juan@test.com' });

      await expect(service.registrar({
        email: 'juan@test.com',
        password: '12345'
      })).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('login', () => {
    test('login exitoso devuelve usuario y token', async () => {
      const usuarioMock = {
        id: 1, email: 'juan@test.com', rol: 'usuario', password: 'hashedPassword'
      };
      Usuario.findOne.mockResolvedValue(usuarioMock);
      bcrypt.compare.mockResolvedValue(true);

      const resultado = await service.login('juan@test.com', '12345');

      expect(resultado.token).toBe('fake-token');
      expect(resultado.usuario.email).toBe('juan@test.com');
    });

    test('lanza error si el usuario no existe', async () => {
      Usuario.findOne.mockResolvedValue(null);

      await expect(
        service.login('noexiste@test.com', '12345')
      ).rejects.toThrow('Credenciales incorrectas');
    });

    test('lanza error si la contraseña es incorrecta', async () => {
      Usuario.findOne.mockResolvedValue({
        id: 1, email: 'juan@test.com', password: 'hashedPassword'
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        service.login('juan@test.com', 'wrongpassword')
      ).rejects.toThrow('Credenciales incorrectas');
    });
  });
});