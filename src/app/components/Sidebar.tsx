import { LayoutDashboard, Package, Users, Building2, QrCode, Plus, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';

export function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/assets', icon: Package, label: 'Jihozlar' },
    { path: '/employees', icon: Users, label: 'Xodimlar' },
    { path: '/departments', icon: Building2, label: 'Bo\'limlar' },
  ];

  const quickActions = [
    { path: '/assets/new', icon: Plus, label: 'Yangi aktiv' },
    { path: '/scan', icon: QrCode, label: 'QR Skanerlash' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Package className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1e3a8a] text-white flex flex-col z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-blue-100 hover:bg-[#1e40af]'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-blue-800">
          <p className="text-xs text-blue-200 mb-3 px-4">Tezkor harakatlar</p>
          {quickActions.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-[#1e40af] transition-colors mb-2"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}