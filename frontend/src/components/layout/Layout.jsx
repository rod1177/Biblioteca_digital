import Navbar from './Navbar.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-blue-900 text-white text-center py-4 mt-8">
        <p>© 2026 - Biblioteca Digital</p>
      </footer>
    </div>
  );
}