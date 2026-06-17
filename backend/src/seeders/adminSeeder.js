import bcrypt from 'bcryptjs';
import { Usuario } from '../models/index.js';

export const crearAdminInicial = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@biblioteca.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existe = await Usuario.findOne({ where: { email } });
  if (existe) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await Usuario.create({
    nombre: 'Administrador',
    apellido: 'Sistema',
    email,
    password: passwordHash,
    rol: 'admin',
    activo: true
  });

  console.log(`✅ Admin creado: ${email} / contraseña: ${password}`);
};
