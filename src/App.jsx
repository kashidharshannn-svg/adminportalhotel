import React, { useState } from 'react';
import ConnectLogin from './components/ConnectLogin';
import ConnectDashboard from './components/ConnectDashboard';
import ConnectWizard from './components/ConnectWizard';
import './App.css';

export default function App() {
  const [partnerUser, setPartnerUser] = useState(null);
  const [isOnboarding, setIsOnboarding] = useState(false);

  return (
    <div className="app-wrapper" style={{ background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!partnerUser ? (
        /* Strictly Partner Login */
        <ConnectLogin 
          onLoginSuccess={(user) => {
            if (user.role === 'admin') {
              alert("Access Denied: Admin accounts cannot register properties here!");
            } else {
              setPartnerUser(user);
            }
          }} 
          forcedRole="partner"
        />
      ) : isOnboarding ? (
        /* Strictly Partner Onboarding Wizard */
        <ConnectWizard 
          activeUser={partnerUser} 
          onFinished={() => setIsOnboarding(false)} 
          onCancel={() => setIsOnboarding(false)} 
        />
      ) : (
        /* Strictly Partner Dashboard */
        <ConnectDashboard 
          activeUser={partnerUser} 
          onLogout={() => setPartnerUser(null)} 
          onStartOnboarding={() => setIsOnboarding(true)} 
        />
      )}
    </div>
  );
}
