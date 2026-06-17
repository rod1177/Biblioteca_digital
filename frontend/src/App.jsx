import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Catalogo from './pages/Catalogo.jsx';
import Prestamos from './pages/Prestamos.jsx';
import Multas from './pages/Multas.jsx';
import Admin from './pages/Admin.jsx';
import MisPrestamos from './pages/MisPrestamos.jsx';
import MisMultas from './pages/MisMultas.jsx';
import CatalogoPublico from './pages/CatalogoPublico.jsx';
import Perfil from './pages/Perfil.jsx';

function RutaAdmin({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (usuario.rol !== 'admin') return <Navigate to="/catalogo-publico" />;
  return children;
}

function RutaUsuario({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Solo Admin */}
          <Route path="/catalogo"  element={<RutaAdmin><Catalogo /></RutaAdmin>} />
          <Route path="/prestamos" element={<RutaAdmin><Prestamos /></RutaAdmin>} />
          <Route path="/multas"    element={<RutaAdmin><Multas /></RutaAdmin>} />
          <Route path="/admin"     element={<RutaAdmin><Admin /></RutaAdmin>} />

          {/* Usuario autenticado */}
          <Route path="/catalogo-publico" element={<RutaUsuario><CatalogoPublico /></RutaUsuario>} />
          <Route path="/mis-prestamos"    element={<RutaUsuario><MisPrestamos /></RutaUsuario>} />
          <Route path="/mis-multas"       element={<RutaUsuario><MisMultas /></RutaUsuario>} />
          <Route path="/perfil"           element={<RutaUsuario><Perfil /></RutaUsuario>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
