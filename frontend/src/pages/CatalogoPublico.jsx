import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import { librosApi, prestamosApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CatalogoPublico() {
  const { t } = useTranslation();
  const { usuario } = useAuth();
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [modalPrestamo, setModalPrestamo] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [dias, setDias] = useState(15);
  const [mensaje, setMensaje] = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      const res = busqueda
        ? await librosApi.buscar(busqueda)
        : await librosApi.listar();
      setLibros(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirModalPrestamo = (libro) => {
    setLibroSeleccionado(libro);
    setDias(15);
    setMensaje('');
    setModalPrestamo(true);
  };

  const fechaLimiteCalculada = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + Number(dias));
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const realizarPrestamo = async () => {
    try {
      await prestamosApi.realizar({
        usuarioId: usuario.id,
        libroId: libroSeleccionado.id,
        dias: Number(dias)
      });
      setMensaje('✅ Préstamo realizado correctamente');
      setTimeout(() => {
        setModalPrestamo(false);
        setMensaje('');
        cargar();
      }, 2000);
    } catch (e) {
      setMensaje('❌ ' + (e.response?.data?.error || 'Error al realizar el préstamo'));
    }
  };

  return (
    <Layout>
      {/* Bienvenida */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
          {usuario?.nombre?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-blue-900">
            Bienvenido, {usuario?.nombre} {usuario?.apellido}
          </p>
          <p className="text-sm text-gray-500">{usuario?.email}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">{t('libros.titulo')}</h1>
      </div>

      {/* Búsqueda */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('libros.buscar')}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && cargar()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <Button onClick={cargar} variant="secondary">🔍</Button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p className="text-center text-gray-500 py-8">{t('comun.cargando')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">{t('libros.tabla.titulo')}</th>
                <th className="px-4 py-3 text-left">{t('libros.tabla.categoria')}</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">{t('libros.tabla.estado')}</th>
                <th className="px-4 py-3 text-left">{t('libros.tabla.acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {libros.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    {t('comun.sinResultados')}
                  </td>
                </tr>
              ) : libros.map(libro => (
                <tr key={libro.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{libro.titulo}</td>
                  <td className="px-4 py-3 text-gray-500">{libro.categoria}</td>
                  <td className="px-4 py-3">{libro.stock}</td>
                  <td className="px-4 py-3"><Badge estado={libro.estado}/></td>
                  <td className="px-4 py-3">
                    <Button
                      variant="success"
                      onClick={() => abrirModalPrestamo(libro)}
                      disabled={libro.stock === 0}>
                      {t('libros.acciones.reservar')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal préstamo */}
      <Modal
        isOpen={modalPrestamo}
        onClose={() => setModalPrestamo(false)}
        titulo={t('prestamos.nuevo')}>
        <div className="space-y-4">
          {/* Info libro */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              📖 <strong>{libroSeleccionado?.titulo}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Stock disponible: <strong>{libroSeleccionado?.stock}</strong> ejemplar(es)
            </p>
          </div>

          {/* Selector de días */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 Plazo del préstamo
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={15}
                value={dias}
                onChange={e => setDias(e.target.value)}
                className="flex-1 accent-blue-700"/>
              <span className="text-blue-900 font-bold text-lg w-16 text-center">
                {dias} día{dias > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              📆 Fecha de devolución: <strong>{fechaLimiteCalculada()}</strong>
            </p>
            {dias >= 13 && (
              <p className="text-xs text-orange-500 mt-1">
                ⚠️ Máximo permitido: 15 días
              </p>
            )}
          </div>

          {mensaje && (
            <p className={`text-sm text-center font-medium
              ${mensaje.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {mensaje}
            </p>
          )}

          {!mensaje && (
            <div className="flex gap-3">
              <Button onClick={realizarPrestamo} className="flex-1">
                {t('libros.acciones.reservar')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setModalPrestamo(false)}
                className="flex-1">
                {t('libros.form.cancelar')}
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
}
