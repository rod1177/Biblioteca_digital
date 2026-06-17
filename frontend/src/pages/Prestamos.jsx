import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import { prestamosApi } from '../services/api.js';

export default function Prestamos() {
  const { t } = useTranslation();
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await prestamosApi.listar();
      setPrestamos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const devolver = async (id) => {
    if (!window.confirm(t('comun.confirmar'))) return;
    try {
      await prestamosApi.devolver(id);
      cargar();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          {t('prestamos.titulo')}
        </h1>
      </div>

      {cargando ? (
        <p className="text-center text-gray-500 py-8">{t('comun.cargando')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.libro')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.usuario')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.fechaPrestamo')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.fechaLimite')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.estado')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    {t('comun.sinResultados')}
                  </td>
                </tr>
              ) : prestamos.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.Libro?.titulo}</td>
                  <td className="px-4 py-3">{p.Usuario?.nombre} {p.Usuario?.apellido}</td>
                  <td className="px-4 py-3">{p.fechaPrestamo}</td>
                  <td className="px-4 py-3">{p.fechaLimite}</td>
                  <td className="px-4 py-3"><Badge estado={p.estado}/></td>
                  <td className="px-4 py-3">
                    {p.estado === 'activo' && (
                      <Button variant="success" onClick={() => devolver(p.id)}>
                        {t('prestamos.acciones.devolver')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}