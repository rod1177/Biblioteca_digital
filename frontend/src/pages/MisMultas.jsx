import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import { multasApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MisMultas() {
  const { t } = useTranslation();
  const { usuario } = useAuth();
  const [multas, setMultas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [confirmar, setConfirmar] = useState({ open: false, id: null });

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await multasApi.listarPorUsuario(usuario.id);
      setMultas(res.data);
    } catch (e) { console.error(e); }
    finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const pagar = async () => {
    try {
      await multasApi.pagar(confirmar.id);
      setConfirmar({ open: false, id: null });
      cargar();
    } catch (e) { console.error(e); }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900">{t('nav.misMultas')}</h1>
      </div>

      {cargando ? (
        <p className="text-center text-gray-500 py-8">{t('comun.cargando')}</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">{t('multas.tabla.libro')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.dias')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.monto')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.estado')}</th>
                <th className="px-4 py-3 text-left">{t('multas.tabla.acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {multas.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">
                  {t('comun.sinResultados')}
                </td></tr>
              ) : multas.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{m.Prestamo?.Libro?.titulo}</td>
                  <td className="px-4 py-3">{m.diasRetraso} días</td>
                  <td className="px-4 py-3 font-medium text-red-600">${m.monto}</td>
                  <td className="px-4 py-3"><Badge estado={m.pagada ? 'pagada' : 'pendiente'}/></td>
                  <td className="px-4 py-3">
                    {!m.pagada && (
                      <Button variant="success" onClick={() => setConfirmar({ open: true, id: m.id })}>
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

      <ConfirmModal
        isOpen={confirmar.open}
        mensaje="¿Confirmar el pago de esta multa?"
        variante="success"
        onConfirm={pagar}
        onCancel={() => setConfirmar({ open: false, id: null })}/>
    </Layout>
  );
}
