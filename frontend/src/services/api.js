import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para agregar token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const librosApi = {
  listar:            () => api.get('/libros'),
  listarDisponibles: () => api.get('/libros/disponibles'),
  buscar:            (titulo) => api.get(`/libros?titulo=${titulo}`),
  crear:             (datos) => api.post('/libros', datos),
  actualizar:        (id, datos) => api.put(`/libros/${id}`, datos),
  eliminar:          (id) => api.delete(`/libros/${id}`)
};

export const usuariosApi = {
  login:    (datos) => api.post('/usuarios/login', datos),
  registrar:(datos) => api.post('/usuarios/registro', datos),
  listar:   () => api.get('/usuarios')
};

export const prestamosApi = {
  listar:           () => api.get('/prestamos'),
  listarPorUsuario: (id) => api.get(`/prestamos/usuario/${id}`),
  realizar:         (datos) => api.post('/prestamos', datos),
  devolver:         (id) => api.put(`/prestamos/${id}/devolver`)
};

export const multasApi = {
  listar:          () => api.get('/multas'),
  listarPendientes:() => api.get('/multas/pendientes'),
  pagar:           (id) => api.put(`/multas/${id}/pagar`)
};

export default api;