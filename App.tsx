
import React, { lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './components/theme/ThemeContext';
import { NotificationProvider } from './components/notifications/NotificationContext';

const Home = lazy(() => import('./pages/Home'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Help = lazy(() => import('./pages/Help'));
const Profile = lazy(() => import('./pages/Profile'));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="projetos" element={<Transactions />} />
                <Route path="meu-portfolio" element={<Portfolio />} />
                <Route path="dao" element={<Wallet />} />
                <Route path="help" element={<Help />} />
                <Route path="perfil" element={<Profile />} />
              </Route>
            </Routes>
        </HashRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
