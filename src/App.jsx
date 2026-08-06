import React, { useState, useEffect } from 'react';
import ConnectLogin from './components/ConnectLogin';
import ConnectDashboard from './components/ConnectDashboard';
import ConnectWizard from './components/ConnectWizard';
import AdminConsole from './components/AdminConsole';
import './App.css';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Persist session user in localStorage to prevent logout on refresh
  const [partnerUser, setPartnerUser] = useState(() => {
    try {
      const stored = localStorage.getItem('connect_session_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [isOnboarding, setIsOnboarding] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleLoginSuccess = (user) => {
    setPartnerUser(user);
    localStorage.setItem('connect_session_user', JSON.stringify(user));
    
    // Automatically redirect admin to the admin route if logged in on main page
    if (user.role === 'admin') {
      window.history.pushState({}, '', '/admin');
      setCurrentPath('/admin');
    }
  };

  const handleLogout = () => {
    setPartnerUser(null);
    setIsOnboarding(false);
    localStorage.removeItem('connect_session_user');
  };

  const isAdminRoute = window.location.hostname.includes('admin') || currentPath === '/admin';

  return (
    <div className="app-wrapper" style={{ background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isAdminRoute ? (
        /* ================= ADMIN ROUTE (/admin) ================= */
        (!partnerUser || partnerUser.role !== 'admin') ? (
          <ConnectLogin 
            onLoginSuccess={(user) => {
              if (user.role !== 'admin') {
                alert("Access Denied: Only Administrator accounts can log in here!");
                handleLogout();
              } else {
                setPartnerUser(user);
                localStorage.setItem('connect_session_user', JSON.stringify(user));
              }
            }} 
            forcedRole="admin"
          />
        ) : (
          <AdminConsole 
            activeUser={partnerUser} 
            onLogout={handleLogout} 
          />
        )
      ) : (
        /* ================= B2B PARTNER ROUTE (/) ================= */
        (!partnerUser || partnerUser.role === 'admin') ? (
          <ConnectLogin 
            onLoginSuccess={handleLoginSuccess} 
            forcedRole="partner"
          />
        ) : isOnboarding ? (
          <ConnectWizard 
            activeUser={partnerUser} 
            onFinished={() => setIsOnboarding(false)} 
            onCancel={() => setIsOnboarding(false)} 
          />
        ) : (
          <ConnectDashboard 
            activeUser={partnerUser} 
            onLogout={handleLogout} 
            onStartOnboarding={() => setIsOnboarding(true)} 
          />
        )
      )}
    </div>
  );
}
