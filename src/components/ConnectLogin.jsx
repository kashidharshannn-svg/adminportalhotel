import React, { useState } from 'react';
import { connectLoginPartner, connectRegisterPartner } from '../data/dbService';
import { Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ConnectLogin({ onLoginSuccess, forcedRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Default helper credentials filled on launch
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
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      background: '#f8fafc',
      flexDirection: window.innerWidth < 850 ? 'column' : 'row'
    }}>
      {/* LEFT SIDEBAR - BRANDING & MARKETING SHOWCASE */}
      <div style={{
        flex: '1.2',
        background: 'linear-gradient(135deg, #091c34 0%, #031024 100%)',
        padding: window.innerWidth < 850 ? '40px 24px' : '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: window.innerWidth < 850 ? 'auto' : '100vh',
        boxSizing: 'border-box'
      }}>
        {/* Decorative background glows */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 140, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 79, 90, 0.12) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        {/* Top Branding Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ∞ connect
            </span>
          </div>

          <h1 style={{ fontSize: window.innerWidth < 850 ? '28px' : '38px', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            Grow your business with Trip Customizer Partner Connect
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '40px', maxWidth: '520px' }}>
            List your hotel, resort, or homestay to instantly showcase it to millions of eager travelers. Manage bookings, pricing, and guest chats seamlessly in one centralized extranet portal.
          </p>

          {/* Benefits Bullet List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                title: "50 Million+ Active Reach",
                desc: "Tap into India's fastest-growing holiday planning and packages network."
              },
              {
                title: "Instant Secure Payouts",
                desc: "Direct settlements credited to your registered bank account on guest check-in."
              },
              {
                title: "Smart Extranet Sync",
                desc: "Dynamic pricing recommendations, occupancy triggers, and live inventory sync."
              },
              {
                title: "Real-time Chat Assistant",
                desc: "Directly chat with guests, resolve booking queries, and boost your ratings."
              }
            ].map((benefit, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#f16825', marginTop: '3px' }}>
                  <CheckCircle2 size={20} fill="rgba(241, 104, 37, 0.1)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>{benefit.title}</h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Banner at Bottom */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '40px'
        }}>
          <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#cbd5e1', margin: 0, lineHeight: '1.5' }}>
            "Onboarding our properties on Trip Customizer was incredibly smooth. Within the first month, our room occupancy grew by 35% and payouts have been absolutely punctual."
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>— General Manager, Grand Candolim Palace & Spa</span>
            <span style={{ fontSize: '11px', color: '#f16825', fontWeight: '700' }}>★★★★★</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - LOGIN FORM SECTION */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: window.innerWidth < 850 ? '40px 20px' : '40px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Quick Credentials Toolbar Helper (Subtle & Elegant) */}
        <div style={{
          position: window.innerWidth < 850 ? 'relative' : 'absolute',
          top: window.innerWidth < 850 ? '0' : '24px',
          right: window.innerWidth < 850 ? '0' : '24px',
          marginBottom: window.innerWidth < 850 ? '24px' : '0',
          display: 'flex',
          gap: '10px'
        }}>
          <button 
            type="button"
            onClick={fillDefaultCredentials}
            style={{
              padding: '8px 14px', fontSize: '11px', fontWeight: '700', borderRadius: '20px',
              border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; }}
          >
            🔑 Quick Partner Login
          </button>
          <button 
            type="button"
            onClick={fillAdminCredentials}
            style={{
              padding: '8px 14px', fontSize: '11px', fontWeight: '700', borderRadius: '20px',
              border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', cursor: 'pointer',
              transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; }}
          >
            🛡️ Quick Admin Login
          </button>
        </div>

        {/* Main Card */}
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          padding: window.innerWidth < 850 ? '30px 20px' : '40px',
          boxSizing: 'border-box'
        }}>
          {/* Card Title */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {isAdminOnly ? "Compliance Admin Sign In" : isLogin ? "B2B Partner Sign In" : "Register as Partner"}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', margin: '6px 0 0 0' }}>
              {isAdminOnly ? "Trip Customizer Approvals & Verification Console" : "Onboard and manage your hotel accommodations"}
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px',
              borderRadius: '8px', fontSize: '12.5px', color: '#ef4444', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && !isAdminOnly && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Contact Name
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }}>
                    <User size={16} />
                  </span>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    style={{
                      width: '100%', padding: '12px 14px 12px 42px', borderRadius: '8px',
                      border: '1px solid #cbd5e1', fontSize: '14px', transition: 'all 0.2s', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#008cff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 140, 255, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isAdminOnly ? "Admin Email" : "Partner Email"}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }}>
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  required 
                  placeholder={isAdminOnly ? "admin@makemytrip.com" : "e.g. partner@myhotel.com"} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: '8px',
                    border: '1px solid #cbd5e1', fontSize: '14px', transition: 'all 0.2s', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#008cff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 140, 255, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }}>
                  <Lock size={16} />
                </span>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', borderRadius: '8px',
                    border: '1px solid #cbd5e1', fontSize: '14px', transition: 'all 0.2s', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#008cff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 140, 255, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Customizer Orange-red Button */}
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f16825 0%, #ff5c26 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(241, 104, 37, 0.25)',
                transition: 'all 0.2s',
                marginTop: '10px'
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(241, 104, 37, 0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(241, 104, 37, 0.25)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span>{isAdminOnly ? "Sign In to Admin Panel" : isLogin ? "Sign In to Partner Console" : "Register Partner Account"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle state */}
          {!isAdminOnly && (
            <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              {isLogin ? "New partner to Trip Customizer network?" : "Already registered as partner?"}{' '}
              <button 
                type="button"
                style={{
                  color: '#f16825', fontWeight: '700', textDecoration: 'underline',
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0
                }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Register Now" : "Sign In"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
