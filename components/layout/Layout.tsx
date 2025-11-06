import React, { useState, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import InteractiveTour from '../help/InteractiveTour';

const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (hasSeenTour !== 'true') {
      // Use a short delay to allow the main UI to render first
      const timer = setTimeout(() => setIsTourOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTour = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setIsTourOpen(false);
  };

  return (
    <div className="flex h-screen font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-200px)]"><LoadingSpinner /></div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <Modal isOpen={isTourOpen} onClose={handleCloseTour} title="Bem-vindo à Plataforma!">
        <InteractiveTour onComplete={handleCloseTour} />
      </Modal>
    </div>
  );
};

export default Layout;