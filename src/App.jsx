import React, { useState } from 'react';
import ConnectLogin from './components/ConnectLogin';
import AdminConsole from './components/AdminConsole';
import './App.css';

export default function App() {
  const [adminUser, setAdminUser] = useState(null);

  return (
    <div className="app-wrapper" style={{ background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!adminUser ? (
        /* Strictly Admin Login */
        <ConnectLogin 
          onLoginSuccess={(user) => {
            if (user.role !== 'admin') {
              alert("Access Denied: Only Administrator accounts can log in here!");
            } else {
              setAdminUser(user);
            }
          }} 
          forcedRole="admin"
        />
      ) : (
        /* Strictly Admin Approvals Console */
        <AdminConsole 
          activeUser={adminUser} 
          onLogout={() => setAdminUser(null)} 
        />
      )}
    </div>
  );
}
