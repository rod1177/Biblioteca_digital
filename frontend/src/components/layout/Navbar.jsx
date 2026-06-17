import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';


export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { esAdmin, logout, usuario } = useAuth();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        <Link to={esAdmin() ? '/catalogo' : '/mis-prestamos'}
          className="text-xl font-bold flex items-center gap-2">
          📚 Biblioteca Digital
        </Link>

        <div className="flex items-center gap-6">
          {esAdmin() ? (
            <>
              <Link to="/catalogo" className="hover:text-blue-300 transition-colors">
                {t('nav.catalogo')}
              </Link>
              <Link to="/prestamos" className="hover:text-blue-300 transition-colors">
                {t('nav.prestamos')}
              </Link>
              <Link to="/multas" className="hover:text-blue-300 transition-colors">
                {t('nav.multas')}
              </Link>
              <Link to="/admin" className="hover:text-blue-300 transition-colors">
                {t('nav.admin')}
              </Link>
            </>
          ) : (
            <>
              <Link to="/catalogo-publico" className="hover:text-blue-300 transition-colors">
                {t('nav.catalogo')}
              </Link>
              <Link to="/mis-prestamos" className="hover:text-blue-300 transition-colors">
                {t('nav.misPrestamos')}
              </Link>
              <Link to="/mis-multas" className="hover:text-blue-300 transition-colors">
                {t('nav.misMultas')}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {['es', 'en', 'fr'].map(lang => (
            <button key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors
                ${i18n.language === lang ? 'bg-white text-blue-900' : 'hover:bg-blue-700'}`}>
              {lang.toUpperCase()}
            </button>
          ))}
          {/* Nombre usuario + Perfil */}
<Link to="/perfil"
  className="flex items-center gap-2 hover:text-blue-300 transition-colors">
  <div className="bg-white text-blue-900 rounded-full w-7 h-7 flex items-center
    justify-center text-sm font-bold">
    {usuario?.nombre?.charAt(0).toUpperCase()}
  </div>
  <span className="text-sm">{usuario?.nombre}</span>
</Link>
          <button onClick={cerrarSesion}
            className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
            {t('nav.cerrarSesion')}
          </button>
        </div>

      </div>
    </nav>
  );
}