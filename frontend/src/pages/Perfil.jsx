import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Badge from '../components/common/Badge.jsx';

export default function Perfil() {
  const { t } = useTranslation();
  const { usuario } = useAuth();

  return (
    <Layout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Mi Perfil</h1>

        <div className="bg-white rounded-xl shadow p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="bg-blue-900 text-white rounded-full w-16 h-16
              flex items-center justify-center text-2xl font-bold">
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {usuario?.nombre} {usuario?.apellido}
              </h2>
              <Badge estado={usuario?.rol}/>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-xs text-gray-400">Correo electrónico</p>
                <p className="font-medium text-gray-800">{usuario?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">👤</span>
              <div>
                <p className="text-xs text-gray-400">Nombre completo</p>
                <p className="font-medium text-gray-800">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔑</span>
              <div>
                <p className="text-xs text-gray-400">Tipo de cuenta</p>
                <Badge estado={usuario?.rol}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}