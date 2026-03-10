import { Bell, User } from 'lucide-react';
import { Link } from 'react-router';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 lg:space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">SB</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl" style={{ fontWeight: 600, color: '#1e3a8a' }}>Smart Bank Office</h1>
              <p className="text-xs text-gray-500">Aktivlarni boshqarish tizimi</p>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p style={{ fontWeight: 600 }}>Admin</p>
              <p className="text-xs text-gray-500">Tizim administratori</p>
            </div>
          </div>
          
          <div className="sm:hidden w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}