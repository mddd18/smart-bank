import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl mb-4">404</h1>
        <h2 className="text-2xl mb-4">Sahifa topilmadi</h2>
        <p className="text-gray-600 mb-8">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          <Home className="h-5 w-5" />
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
