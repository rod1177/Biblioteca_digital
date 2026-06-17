import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import { multasApi } from '../services/api.js';

export default function Multas() {
  const { t } = useTranslation();
  const [multas, setMultas] = useState([]);
  const [soloPendientes, setSoloPendientes] = useState(false);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      const res = soloPendientes
        ? await multasApi.listarPendientes()
        : await multasApi.listar();
      setMultas(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [soloPendientes]);

  const pagar = async (id) => {
    if (!window.confirm(t('comun.confirmar'))) return;
    try {
      await multasApi.pagar(id);
      cargar();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">
          {t('multas.titulo')}
        </h1>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={soloPendientes}
            onChange={e => setSoloPendientes(e.target.checked)}
            className="rounded"/>
          {t('multas.pendientes')}
        </label>
      </div>

      {cargando ? (
        <p className="text-center text-gray-500 py-8">{t('comun.cargando')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">{t('multas.tabla.usuario')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.libro')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.dias')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.monto')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.estado')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {multas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    {t('comun.sinResultados')}
                  </td>
                </tr>
              ) : multas.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{m.Usuario?.nombre} {m.Usuario?.apellido}</td>
                  <td className="px-4 py-3">{m.Prestamo?.Libro?.titulo}</td>
                  <td className="px-4 py-3">{m.diasRetraso} días</td>
                  <td className="px-4 py-3 font-medium text-red-600">${m.monto}</td>
                  <td className="px-4 py-3">
                    <Badge estado={m.pagada ? 'pagada' : 'pendiente'}/>
                  </td>
                  <td className="px-4 py-3">
                    {!m.pagada && (
                      <Button variant="success" onClick={() => pagar(m.id)}>
                        {t('multas.acciones.pagar')}
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