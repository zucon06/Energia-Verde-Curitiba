
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS } from '../../constants';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const logout = () => {
    // This is now a mock function and does nothing.
    console.log("Logout action is disabled.");
  };

  const navItems = [
    { to: '/', icon: ICONS.dashboard, label: 'Dashboard' },
    { to: '/projetos', icon: ICONS.projects, label: 'Projetos' },
    { to: '/meu-portfolio', icon: ICONS.myPortfolio, label: 'Meu Portfólio' },
    { to: '/dao', icon: ICONS.dao, label: 'DAO' },
    { to: '/help', icon: ICONS.help, label: 'Ajuda' },
  ];

  const baseLinkClasses = "flex items-center px-4 py-3 rounded-lg transition-all duration-200 transform";
  const inactiveLinkClasses = "font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:translate-x-1";
  const activeLinkClasses = "bg-brand-green/10 text-brand-green dark:bg-brand-green/20 dark:text-green-300 font-bold";

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 lg:w-64 bg-white dark:bg-gray-800 transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center px-4">Energia Verde Curitiba</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              {item.icon}
              <span className="ml-4">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={logout} className={`${baseLinkClasses} ${inactiveLinkClasses} w-full`}>
            {ICONS.logout}
            <span className="ml-4">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;