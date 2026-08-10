import React, { useState } from 'react';
import { connectLoginPartner, connectRegisterPartner } from '../data/dbService';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function ConnectLogin({ onLoginSuccess, forcedRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Default helper filled on launch
  const fillDefaultCredentials = () => {
    setEmail('rj@makemytrip.com');
    setPassword('rj123');
    setIsLogin(true);
  };

  const fillAdminCredentials = () => {
    setEmail('admin@makemytrip.com');
    setPassword('admin123');
    setIsLogin(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const partner = await connectLoginPartner(email, password);
        onLoginSuccess(partner);
      } else {
        const partner = await connectRegisterPartner(email, password, name);
        alert("Partner account registered successfully!");
        onLoginSuccess(partner);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const isAdminOnly = forcedRole === 'admin';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #051429 0%, #0a2240 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        textAlign: 'left',
        position: 'relative'
      }}>
        
        {/* Banner Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '32px', fontWeight: '800', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
            ∞ connect
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginTop: '6px' }}>
            Trip Customizer Partner Network
          </span>
        </div>

        <h3 style={{ fontWeight: '800', fontSize: '20px', color: '#1e293b', marginBottom: '6px', textAlign: 'center' }}>
          {isAdminOnly ? "Compliance Admin Sign In" : isLogin ? "B2B Partner Sign In" : "Register as Partner"}
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px', textAlign: 'center' }}>
          {isAdminOnly ? "Trip Customizer Approvals & Verification Console" : "Onboard and manage your hotel accommodations"}
        </p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#ef4444', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && !isAdminOnly && (
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                <User size={12} /> Contact Name
              </label>
              <input 
                type="text" 
                required 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          )}

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
              <Mail size={12} /> {isAdminOnly ? "Admin Email" : "Partner Email"}
            </label>
            <input 
              type="email" 
              required 
              placeholder={isAdminOnly ? "admin@makemytrip.com" : "e.g. partner@myhotel.com"} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
              <Lock size={12} /> Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ justifyContent: 'center', marginTop: '10px', padding: '12px', background: 'linear-gradient(90deg, #ff4f5a 0%, #ff6872 100%)', border: 'none' }}
          >
            {isAdminOnly ? "Sign In to Admin Panel" : isLogin ? "Sign In to Partner Console" : "Register Partner Account"}
          </button>
        </form>



        {!isAdminOnly && (
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#64748b' }}>
            {isLogin ? "New partner to Trip Customizer network?" : "Already registered as partner?"}{' '}
            <button 
              type="button"
              style={{ color: '#ff4f5a', fontWeight: '700', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register Now" : "Sign In"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
