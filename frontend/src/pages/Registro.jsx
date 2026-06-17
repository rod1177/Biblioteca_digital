import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usuariosApi } from '../services/api.js';
import Button from '../components/common/Button.jsx';

export default function Registro() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

    const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: ''
    });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      await usuariosApi.registrar(form);
      setExito(t('registro.exito'));
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError(t('comun.error'));
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
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📚</div>
          <h1 className="text-2xl font-bold text-blue-900">
            {t('registro.titulo')}
          </h1>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        {exito && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
            {exito}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('registro.nombre')}
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('registro.apellido')}
              </label>
              <input
                type="text"
                value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('registro.email')}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('registro.password')}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>



          <Button type="submit" disabled={cargando} className="w-full">
            {cargando ? t('comun.cargando') : t('registro.btn')}
          </Button>
        </form>

        {/* Link a login */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('registro.yaTienes')}{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            {t('registro.iniciarSesion')}
          </Link>
        </p>

      </div>
    </div>
  );
}