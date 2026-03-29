'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TMAContextType {
  user: any;
  isReady: boolean;
  theme: any;
}

const TMAContext = createContext<TMAContextType | null>(null);

export const TMAProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready();
      WebApp.expand();
      
      // Prevent vertical swipe-to-close
      WebApp.enableClosingConfirmation();

      setTheme(WebApp.themeParams);
      
      // Validate user on backend
      const validateUser = async () => {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify({ initData: WebApp.initData }),
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error('TMA Auth Error:', error);
        } finally {
          setIsReady(true);
        }
      };

      validateUser();
    }
  }, []);

  return (
    <TMAContext.Provider value={{ user, isReady, theme }}>
      <div 
        style={{ 
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          color: 'var(--tg-theme-text-color, #000000)',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </TMAContext.Provider>
  );
};

export const useTMA = () => {
  const context = useContext(TMAContext);
  if (!context) throw new Error('useTMA must be used within TMAProvider');
  return context;
};
