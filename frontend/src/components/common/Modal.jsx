export default function Modal({ isOpen, onClose, titulo, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}/>

      {/* Contenido */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}