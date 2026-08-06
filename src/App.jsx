import React, { useState, useEffect } from 'react';
import ConnectLogin from './components/ConnectLogin';
import ConnectDashboard from './components/ConnectDashboard';
import ConnectWizard from './components/ConnectWizard';
import AdminConsole from './components/AdminConsole';
import './App.css';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [partnerUser, setPartnerUser] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleLogout = () => {
    setPartnerUser(null);
    setIsOnboarding(false);
  };

  const isAdminRoute = currentPath === '/admin';

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
            onLoginSuccess={(user) => {
              if (user.role === 'admin') {
                // Redirect admin automatically to /admin route if logged in on main
                setPartnerUser(user);
                window.history.pushState({}, '', '/admin');
                setCurrentPath('/admin');
              } else {
                setPartnerUser(user);
              }
            }} 
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
