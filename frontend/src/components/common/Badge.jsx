import { useTranslation } from 'react-i18next';

export default function Badge({ estado }) {
  const { t } = useTranslation();

  const colores = {
    disponible: 'bg-green-100 text-green-800',
    prestado:   'bg-red-100 text-red-800',
    reservado:  'bg-yellow-100 text-yellow-800',
    activo:     'bg-blue-100 text-blue-800',
    devuelto:   'bg-gray-100 text-gray-800',
    vencido:    'bg-orange-100 text-orange-800',
    pendiente:  'bg-red-100 text-red-800',
    pagada:     'bg-green-100 text-green-800',
    usuario:    'bg-purple-100 text-purple-800',
    estudiante: 'bg-purple-100 text-purple-800',
    profesor:   'bg-indigo-100 text-indigo-800',
    admin:      'bg-blue-100 text-blue-800',
    true:       'bg-green-100 text-green-800',
    false:      'bg-red-100 text-red-800',
  };

  const estadoStr = String(estado);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium 
      ${colores[estadoStr] || 'bg-gray-100 text-gray-800'}`}>
      {t(`estado.${estadoStr}`, { defaultValue: estadoStr })}
    </span>
  );
}
