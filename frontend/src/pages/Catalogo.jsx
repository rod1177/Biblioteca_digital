import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import { librosApi } from '../services/api.js';

export default function Catalogo() {
  const { t } = useTranslation();
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [modalLibro, setModalLibro] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [confirmar, setConfirmar] = useState({ open: false, id: null });
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
    } catch (e) { console.error(e); }
    finally { setCargando(false); }
  };

  useEffect(() => { cargarLibros(); }, [soloDisponibles]);

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
    } catch (e) { console.error(e); }
  };

  const editarLibro = (libro) => {
    setLibroSeleccionado(libro);
    setForm({
      titulo: libro.titulo, isbn: libro.isbn || '',
      categoria: libro.categoria || '', anio: libro.anio || '',
      stock: libro.stock, descripcion: libro.descripcion || ''
    });
    setModalLibro(true);
  };

  const confirmarEliminar = (id) => setConfirmar({ open: true, id });

  const eliminarLibro = async () => {
    await librosApi.eliminar(confirmar.id);
    setConfirmar({ open: false, id: null });
    cargarLibros();
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          {t('libros.titulo')} — Gestión
        </h1>
        <Button onClick={() => { setLibroSeleccionado(null); setModalLibro(true); }}>
          + {t('libros.nuevo')}
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text" placeholder={t('libros.buscar')} value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && cargarLibros()}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <Button onClick={cargarLibros} variant="secondary">🔍</Button>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={soloDisponibles}
            onChange={e => setSoloDisponibles(e.target.checked)} className="rounded"/>
          {t('libros.disponibles')}
        </label>
      </div>

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
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">
                  {t('comun.sinResultados')}
                </td></tr>
              ) : libros.map(libro => (
                <tr key={libro.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{libro.titulo}</td>
                  <td className="px-4 py-3 text-gray-500">{libro.categoria}</td>
                  <td className="px-4 py-3">{libro.stock}</td>
                  <td className="px-4 py-3"><Badge estado={libro.estado}/></td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button variant="secondary" onClick={() => editarLibro(libro)}>
                      ✏️ {t('libros.acciones.editar')}
                    </Button>
                    <Button variant="danger" onClick={() => confirmarEliminar(libro.id)}>
                      🗑️ {t('libros.acciones.eliminar')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal agregar/editar */}
      <Modal isOpen={modalLibro} onClose={() => setModalLibro(false)}
        titulo={libroSeleccionado ? t('libros.acciones.editar') : t('libros.nuevo')}>
        <form onSubmit={guardarLibro} className="space-y-3">
          {[
            { key: 'titulo',    label: t('libros.form.titulo'),    type: 'text' },
            { key: 'isbn',      label: t('libros.form.isbn'),      type: 'text' },
            { key: 'categoria', label: t('libros.form.categoria'), type: 'text' },
            { key: 'anio',      label: t('libros.form.anio'),      type: 'number' },
            { key: 'stock',     label: t('libros.form.stock'),     type: 'number' }
          ].map(campo => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
              <input type={campo.type} value={form[campo.key]}
                onChange={e => setForm({ ...form, [campo.key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('libros.form.descripcion')}
            </label>
            <textarea value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{t('libros.form.guardar')}</Button>
            <Button variant="secondary" onClick={() => setModalLibro(false)} className="flex-1">
              {t('libros.form.cancelar')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal confirmar eliminar */}
      <ConfirmModal
        isOpen={confirmar.open}
        mensaje="¿Eliminar este libro del catálogo?"
        variante="danger"
        onConfirm={eliminarLibro}
        onCancel={() => setConfirmar({ open: false, id: null })}/>
    </Layout>
  );
}
