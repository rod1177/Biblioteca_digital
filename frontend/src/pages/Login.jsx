import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usuariosApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setCargando(true);
  setError('');
  try {
        const res = await usuariosApi.login(form);
        login(res.data.usuario, res.data.token);
        if (res.data.usuario.rol === 'admin') {
        navigate('/catalogo');
        } else {
        navigate('/catalogo-publico');
    }

  } catch {
    setError(t('login.error'));
  } finally {
    setCargando(false);
  }
};

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        {/* Idiomas */}
        <div className="flex justify-end gap-2 mb-6">
          {['es', 'en', 'fr'].map(lang => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className={`px-2 py-1 rounded text-sm font-medium border transition-colors
                ${i18n.language === lang
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'border-gray-300 hover:bg-gray-100'}`}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-blue-900">
            {t('login.marca')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t('login.titulo')}</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('login.email')}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('login.placeholder_email')}/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('login.password')}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('login.placeholder_password')}/>
          </div>

          <Button
            type="submit"
            disabled={cargando}
            className="w-full justify-center">
            {cargando ? t('comun.cargando') : t('login.btn')}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
           {t('registro.noTienes')}{' '}
         <Link to="/registro" className="text-blue-600 hover:underline">
              {t('registro.crearCuenta')}
         </Link>
        </p>

      </div>
    </div>
  );
}