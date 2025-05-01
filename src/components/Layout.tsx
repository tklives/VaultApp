import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

const navItems = [
  { path: '/vaulters', label: 'Vaulters', icon: Users },
  { path: '/meets', label: 'Meets', icon: Calendar },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-50 bg-gray-100 border-b shadow-sm h-14 flex items-center px-4">
        {/* Logo (links to home) */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold mr-6">
          <div className="w-6 h-6 bg-gray-400 rounded" /> {/* Logo placeholder */}
          VaultMaster
        </Link>

        {/* Main Nav */}
        <nav className="flex gap-6 items-center text-sm">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                pathname === path ? 'text-blue-700 font-semibold' : 'text-gray-700'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
