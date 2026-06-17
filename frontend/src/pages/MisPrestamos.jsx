import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import { prestamosApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MisPrestamos() {
  const { t } = useTranslation();
  const { usuario } = useAuth();
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await prestamosApi.listarPorUsuario(usuario.id);
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

  const diasRestantes = (fechaLimite) => {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const dias = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
    return dias;
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900">{t('nav.misPrestamos')}</h1>
      </div>

      {cargando ? (
        <p className="text-center text-gray-500 py-8">{t('comun.cargando')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.libro')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.fechaPrestamo')}</th>
                <th className="px-4 py-3 text-left">{t('prestamos.tabla.fechaLimite')}</th>
                <th className="px-4 py-3 text-left">Tiempo restante</th>
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
              ) : prestamos.map(p => {
                const dias = diasRestantes(p.fechaLimite);
                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.Libro?.titulo}</td>
                    <td className="px-4 py-3">{p.fechaPrestamo}</td>
                    <td className="px-4 py-3">{p.fechaLimite}</td>
                    <td className="px-4 py-3">
                      {p.estado === 'activo' && (
                        <span className={`font-medium ${dias < 0 ? 'text-red-600' : dias <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                          {dias < 0 ? `${Math.abs(dias)} días de retraso` : `${dias} días restantes`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3"><Badge estado={p.estado}/></td>
                    <td className="px-4 py-3">
                      {p.estado === 'activo' && (
                        <Button variant="success" onClick={() => devolver(p.id)}>
                          {t('prestamos.acciones.devolver')}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}