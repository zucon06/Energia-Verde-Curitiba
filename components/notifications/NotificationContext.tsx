
import React, { createContext, useState, useContext, useMemo, useRef, useCallback } from 'react';

interface NotificationContextType {
  isNewProposal: boolean;
  showNotification: () => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNewProposal, setIsNewProposal] = useState(false);
  const notificationTimeoutRef = useRef<number | null>(null);

  const clearNotification = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }
    setIsNewProposal(false);
  }, []);

  const showNotification = useCallback(() => {
    // Clear any existing timeout to reset the timer
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    setIsNewProposal(true);
    
    notificationTimeoutRef.current = window.setTimeout(() => {
      setIsNewProposal(false);
      notificationTimeoutRef.current = null;
    }, 5000); // Notification lasts for 5 seconds
  }, []);

  const contextValue = useMemo(() => ({
    isNewProposal,
    showNotification,
    clearNotification,
  }), [isNewProposal, showNotification, clearNotification]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
