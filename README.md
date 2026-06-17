# 📚 Biblioteca Digital

## Inicio rápido

### 1. Configura la base de datos
Edita el archivo `backend/.env` y pon tu contraseña de MySQL:
```
DB_PASSWORD=tu_password_aqui
```

### 2. Instala dependencias (solo la primera vez)
```bash
npm run install:all
```

### 3. Inicia el proyecto completo
```bash
npm run dev
```
Esto levanta **backend** (puerto 3000) y **frontend** (puerto 5173) al mismo tiempo.

---

##Base de datos
Sequelize crea las tablas automáticamente al iniciar el backend.
Solo necesitas tener MySQL corriendo y la base de datos creada:
```sql
CREATE DATABASE biblioteca_digital;
```

## Credenciales de prueba
Registra un usuario desde `/registro` y cámbialo a admin directamente en MySQL:
```sql
UPDATE usuarios SET rol = 'admin' WHERE email = 'tu@email.com';
```

---

## Rutas disponibles

| Rol | Rutas |
|-----|-------|
| Admin | `/catalogo`, `/prestamos`, `/multas`, `/admin` |
| Usuario | `/catalogo-publico`, `/mis-prestamos`, `/mis-multas`, `/perfil` |
| Público | `/login`, `/registro` |

## Arquitectura
- **Backend:** Node.js + Express + Sequelize + MySQL
- **Frontend:** React + Vite + Tailwind CSS
- **Patrones:** Facade, Observer, State, Strategy
- **Auth:** JWT con roles (admin / usuario)
- **i18n:** Español, Inglés, Francés
