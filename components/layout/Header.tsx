
import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../../constants';
import { useNotification } from '../notifications/NotificationContext';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isNewProposal, clearNotification } = useNotification();
  const user = { 
    name: 'Elon Musk', 
    title: 'Technoking',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <label htmlFor="header-search" className="sr-only">Pesquisar projetos</label>
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
            {ICONS.search}
          </span>
          <input
            id="header-search"
            className="w-full pl-10 pr-4 py-2 text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            type="text"
            placeholder="Pesquisar projetos..."
          />
        </div>
        
        <Link
          to="/dao"
          onClick={clearNotification}
          className="relative p-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-brand-green transition-transform hover:scale-110"
          aria-label={isNewProposal ? "Notificações de propostas da DAO. Você tem uma nova notificação." : "Notificações de propostas da DAO"}
        >
          {ICONS.notification}
          {isNewProposal && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800 animate-pulse" aria-hidden="true"></span>
          )}
        </Link>

        {user && (
          <Link to="/perfil" className="flex items-center space-x-3 cursor-pointer group transition-transform duration-200">
              <img 
                  className="h-10 w-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-brand-green transition-all bg-gray-200 dark:bg-gray-700" 
                  src={user.avatar} 
                  alt={user ? `Avatar de ${user.name}` : 'Avatar do usuário'} 
              />
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.title}</p>
              </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;