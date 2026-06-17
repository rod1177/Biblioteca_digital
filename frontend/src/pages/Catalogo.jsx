import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import { librosApi, usuariosApi, prestamosApi } from '../services/api.js';

export default function Catalogo() {
  const { t } = useTranslation();
  const [libros, setLibros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [modalLibro, setModalLibro] = useState(false);
  const [modalPrestamo, setModalPrestamo] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [usuarioId, setUsuarioId] = useState('');
  const [form, setForm] = useState({
    titulo: '', isbn: '', categoria: '',
    anio: '', stock: 1, descripcion: ''
  });

  const cargarLibros = async () => {
    setCargando(true);
    try {
      const res = soloDisponibles
        ? await librosApi.listarDisponibles()
        : busqueda
          ? await librosApi.buscar(busqueda)
          : await librosApi.listar();
      setLibros(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarLibros(); }, [soloDisponibles]);

  useEffect(() => {
    usuariosApi.listar().then(res => setUsuarios(res.data));
  }, []);

  const guardarLibro = async (e) => {
    e.preventDefault();
    try {
      if (libroSeleccionado) {
        await librosApi.actualizar(libroSeleccionado.id, form);
      } else {
        await librosApi.crear(form);
      }
      setModalLibro(false);
      setLibroSeleccionado(null);
      setForm({ titulo: '', isbn: '', categoria: '', anio: '', stock: 1, descripcion: '' });
      cargarLibros();
    } catch (e) {
      console.error(e);
    }
  };

  const editarLibro = (libro) => {
    setLibroSeleccionado(libro);
    setForm({
      titulo: libro.titulo,
      isbn: libro.isbn || '',
      categoria: libro.categoria || '',
      anio: libro.anio || '',
      stock: libro.stock,
      descripcion: libro.descripcion || ''
    });
    setModalLibro(true);
  };

  const eliminarLibro = async (id) => {
    if (!window.confirm(t('comun.confirmar'))) return;
    await librosApi.eliminar(id);
    cargarLibros();
  };

  const abrirModalPrestamo = (libro) => {
    setLibroSeleccionado(libro);
    setModalPrestamo(true);
  };

  const realizarPrestamo = async (e) => {
    e.preventDefault();
    try {
      await prestamosApi.realizar({
        usuarioId: parseInt(usuarioId),
        libroId: libroSeleccionado.id
      });
      setModalPrestamo(false);
      setUsuarioId('');
      cargarLibros();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          {t('libros.titulo')}
        </h1>
        <Button onClick={() => { setLibroSeleccionado(null); setModalLibro(true); }}>
          + {t('libros.nuevo')}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('libros.buscar')}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && cargarLibros()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <Button onClick={cargarLibros} variant="secondary">
          🔍
        </Button>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={e => setSoloDisponibles(e.target.checked)}
            className="rounded"/>
          {t('libros.disponibles')}
        </label>
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
                  <td className="px-4 py-3">
                    <Badge estado={libro.estado}/>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="success"
                      onClick={() => abrirModalPrestamo(libro)}
                      disabled={libro.estado !== 'disponible'}>
                      {t('libros.acciones.prestar')}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => editarLibro(libro)}>
                      {t('libros.acciones.editar')}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => eliminarLibro(libro.id)}>
                      {t('libros.acciones.eliminar')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal libro */}
      <Modal
        isOpen={modalLibro}
        onClose={() => setModalLibro(false)}
        titulo={libroSeleccionado ? t('libros.acciones.editar') : t('libros.nuevo')}>
        <form onSubmit={guardarLibro} className="space-y-3">
          {[
            { key: 'titulo', label: t('libros.form.titulo'), type: 'text' },
            { key: 'isbn', label: t('libros.form.isbn'), type: 'text' },
            { key: 'categoria', label: t('libros.form.categoria'), type: 'text' },
            { key: 'anio', label: t('libros.form.anio'), type: 'number' },
            { key: 'stock', label: t('libros.form.stock'), type: 'number' }
          ].map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {campo.label}
              </label>
              <input
                type={campo.type}
                value={form[campo.key]}
                onChange={e => setForm({ ...form, [campo.key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('libros.form.descripcion')}
            </label>
            <textarea
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              {t('libros.form.guardar')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setModalLibro(false)}
              className="flex-1">
              {t('libros.form.cancelar')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal préstamo */}
{/* Modal préstamo */}
<Modal
  isOpen={modalPrestamo}
  onClose={() => setModalPrestamo(false)}
  titulo={t('prestamos.nuevo')}>
  <form onSubmit={realizarPrestamo} className="space-y-4">
    <div className="bg-blue-50 rounded-lg p-3">
      <p className="text-sm text-gray-600">
        📖 <strong>{libroSeleccionado?.titulo}</strong>
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Stock disponible: <strong>{libroSeleccionado?.stock}</strong> ejemplar(es)
      </p>
      <p className="text-sm text-blue-700 mt-1">
        📅 Fecha límite de devolución:{' '}
        <strong>
          {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            .toLocaleDateString()}
        </strong>
        {' '}(15 días)
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t('prestamos.tabla.usuario')}
      </label>
      <select
        value={usuarioId}
        onChange={e => setUsuarioId(e.target.value)}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Seleccionar usuario...</option>
        {usuarios
          .filter(u => u.rol !== 'admin')
          .map(u => (
            <option key={u.id} value={u.id}>
              {u.nombre} {u.apellido} — {u.rol}
            </option>
          ))}
      </select>
    </div>

    <div className="flex gap-3 pt-2">
      <Button type="submit" className="flex-1">
        {t('libros.acciones.prestar')}
      </Button>
      <Button
        variant="secondary"
        onClick={() => setModalPrestamo(false)}
        className="flex-1">
        {t('libros.form.cancelar')}
      </Button>
    </div>
  </form>
</Modal>

    </Layout>
  );
}