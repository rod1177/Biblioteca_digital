import Button from './Button.jsx';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, mensaje, variante = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel}/>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl
            ${variante === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
            {variante === 'danger' ? '🗑️' : '⚠️'}
          </div>
          <p className="text-gray-700 font-medium text-base">{mensaje || '¿Estás seguro?'}</p>
          <div className="flex gap-3 w-full">
            <Button variant={variante} onClick={onConfirm} className="flex-1">
              Confirmar
            </Button>
            <Button variant="secondary" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
