export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = ''
}) {
  const variantes = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantes[variant]} ${className}`}>
      {children}
    </button>
  );
}