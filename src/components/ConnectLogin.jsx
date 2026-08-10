import React, { useState, useEffect } from 'react';
import { connectLoginPartner, connectRegisterPartner } from '../data/dbService';
import { Mail, Lock, User, Check, ChevronDown, ChevronUp, Download, Building2, TrendingUp, Percent, ShieldCheck } from 'lucide-react';

export default function ConnectLogin({ onLoginSuccess, forcedRole }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // 1. Typewriter property types cycler
  const propertyTypes = ["Hotel", "Resort", "Homestay & Villa", "Lodge, Bed & B'fast", "Apartment", "Dharamshala"];
  const [propIndex, setPropIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPropIndex(prev => (prev + 1) % propertyTypes.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 2. Interactive Feature Accordion state
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      title: "Digital onboarding in minutes",
      description: "Get your property listed for free, in just 30 minutes with our smart step-by-step onboarding wizard.",
      mockupType: "onboarding"
    },
    {
      title: "Full control on rates & availability and bookings",
      description: "Manage room inventories, set flexible rates, and block/unblock rooms dynamically at a moment's notice.",
      mockupType: "rates"
    },
    {
      title: "Real-time analytics for better decision making",
      description: "Track guest occupancy rates, revenue statistics, and booking patterns via a detailed graphical dashboard.",
      mockupType: "analytics"
    },
    {
      title: "Customisable promotions & offers",
      description: "Set targeted discounts, coupon codes, and corporate offers to stand out and attract high-value guests.",
      mockupType: "promotions"
    },
    {
      title: "Guest reviews & ratings",
      description: "Monitor guest feedback, reply to user ratings, and enhance your marketplace quality score directly.",
      mockupType: "reviews"
    },
    {
      title: "Simplified payments",
      description: "Receive timely payouts for your bookings with detailed invoice reports and easy-to-track payment histories.",
      mockupType: "payments"
    }
  ];

  // Fillers for testing
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
      fontFamily: "'Inter', sans-serif",
      color: '#1e293b',
      background: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. TOP NAVBAR */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '26px', fontWeight: '850', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ∞ connect
          </span>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
            by Trip Customizer
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>Features</span>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px',
            border: '1px solid #cbd5e1', background: 'transparent', fontSize: '13px', fontWeight: '700',
            color: '#334155', cursor: 'pointer'
          }}>
            <Download size={14} /> Download App
          </button>
          <button onClick={() => setIsLogin(false)} style={{
            background: '#e0532b', color: '#ffffff', border: 'none', padding: '10px 20px',
            borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(224, 83, 43, 0.2)'
          }}>
            List New Property For Free
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION WITH INTEGRATED GLASSMORPHIC LOGIN CARD */}
      <div style={{
        backgroundImage: `linear-gradient(rgba(10, 34, 64, 0.7), rgba(3, 16, 36, 0.85)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 60px 100px 60px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Left marketing columns */}
        <div style={{ color: '#ffffff', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '44px', fontWeight: '900', lineHeight: '1.2', margin: 0,
            letterSpacing: '-1px', height: '110px'
          }}>
            List your <span style={{
              color: '#ff6b3d',
              borderBottom: '3px solid #ff6b3d',
              transition: 'opacity 0.3s ease-in-out',
              opacity: fade ? 1 : 0,
              display: 'inline-block'
            }}>{propertyTypes[propIndex]}</span> <br />
            for free & grow your business
          </h2>
          <p style={{ fontSize: '18px', color: '#cbd5e1', marginTop: '16px', fontWeight: '500' }}>
            Partner with Trip Customizer group
          </p>
          
          {/* Logo labels */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
            <span style={{ fontSize: '14px', fontWeight: '850', color: '#ff4f5a' }}>∞ connect</span>
            <span style={{ color: '#64748b', fontSize: '16px' }}>|</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#008cff' }}>trip customizer</span>
            <span style={{ color: '#64748b', fontSize: '16px' }}>|</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#e0532b' }}>b2b connect</span>
            <span style={{ color: '#64748b', fontSize: '16px' }}>|</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>partner network</span>
          </div>

          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '30px' }}>
            Join a community of 15,00,000+ registered listings across India.
          </p>
        </div>

        {/* Right Glassmorphic Form Card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Developer Quick-fill buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', zIndex: 10 }}>
            <button onClick={fillDefaultCredentials} style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '700', cursor: 'pointer'
            }}>
              🔑 Quick Partner Login
            </button>
            <button onClick={fillAdminCredentials} style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: '20px',
              fontSize: '11px', fontWeight: '700', cursor: 'pointer'
            }}>
              🛡️ Quick Admin Login
            </button>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '420px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            color: '#ffffff',
            boxSizing: 'border-box',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0' }}>
              {isAdminOnly ? "Compliance Admin Sign In" : isLogin ? "Sign in to manage your property" : "Create your partner account"}
            </h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 24px 0', lineHeight: 1.4 }}>
              {isAdminOnly ? "Admin Verification & Compliance Portal" : isLogin ? "Welcome back! Please enter your details." : "Register and list your hotel today."}
            </p>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: '#fca5a5', marginBottom: '20px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isLogin && !isAdminOnly && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Contact Name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#cbd5e1' }}><User size={14} /></span>
                    <input 
                      type="text" required placeholder="Enter contact name" value={name} onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)', color: '#ffffff', outline: 'none', boxSizing: 'border-box', fontSize: '13px'
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Username/Email address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#cbd5e1' }}><Mail size={14} /></span>
                  <input 
                    type="email" required placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)', color: '#ffffff', outline: 'none', boxSizing: 'border-box', fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#cbd5e1' }}><Lock size={14} /></span>
                  <input 
                    type="password" required placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)', color: '#ffffff', outline: 'none', boxSizing: 'border-box', fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {isLogin && <span style={{ fontSize: '11.5px', color: '#cbd5e1', cursor: 'pointer', textAlign: 'right', marginTop: '-4px' }}>Forgot your password?</span>}

              <button type="submit" style={{
                background: '#e0532b', color: '#ffffff', border: 'none', padding: '12px',
                borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                transition: 'background 0.2s', marginTop: '10px', width: '100%'
              }}>
                {isAdminOnly ? "Sign In to Admin Panel" : isLogin ? "Sign In" : "Register Partner Account"}
              </button>
            </form>

            {!isAdminOnly && (
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12.5px', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                {isLogin ? "New to Connect?" : "Already registered?"}{' '}
                <button onClick={() => setIsLogin(!isLogin)} style={{
                  color: '#ff6b3d', fontWeight: '700', textDecoration: 'underline', background: 'transparent',
                  border: 'none', cursor: 'pointer', padding: 0
                }}>
                  {isLogin ? "Create an account" : "Sign in here"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. OVERLAPPING STATS BANNER */}
      <div style={{
        padding: '0 60px',
        marginTop: '-40px',
        position: 'relative',
        zIndex: 5,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
      }}>
        {[
          { stat: "48.2 Cr+", desc: "Annual visitors, globally. Reach travellers actively searching for unique stays on Trip Customizer platforms." },
          { stat: "3.1 Cr+", desc: "Room check-ins per year, across the world." },
          { stat: "80+", desc: "Channel Managers network. Connect seamlessly with us & enjoy hassle-free property management." }
        ].map((item, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px 30px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#e0532b', margin: '0 0 10px 0' }}>{item.stat}</h3>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 4. FEATURES ACCORDION & MOCKUP SHOWCASE */}
      <div style={{ padding: '80px 60px', background: '#f8fafc', textAlign: 'left' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#e0532b', textTransform: 'uppercase', letterSpacing: '1px' }}>Features</span>
        <h2 style={{ fontSize: '32px', fontWeight: '850', color: '#0f172a', margin: '8px 0 40px 0' }}>Manage & grow your business</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'center' }}>
          {/* Left Feature List Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((feat, idx) => {
              const isOpen = activeFeature === idx;
              return (
                <div 
                  key={idx} 
                  onClick={() => setActiveFeature(idx)}
                  style={{
                    background: '#ffffff',
                    border: isOpen ? '1px solid #e0532b' : '1px solid #e2e8f0',
                    borderLeft: isOpen ? '4px solid #e0532b' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '750', color: isOpen ? '#e0532b' : '#334155' }}>
                      {feat.title}
                    </span>
                    {isOpen ? <ChevronUp size={16} color="#e0532b" /> : <ChevronDown size={16} color="#64748b" />}
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '13px', color: '#475569', marginTop: '10px', margin: '10px 0 0 0', lineHeight: 1.5 }}>
                      {feat.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Live CSS Dashboard Mockup (Interactive based on selection!) */}
          <div style={{
            background: '#0a2240',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            height: '380px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Mockup Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '10px', fontWeight: '600' }}>Trip Customizer Extranet Panel</span>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(255, 79, 90, 0.15)', color: '#ff4f5a', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>LIVE MODE</span>
            </div>

            {/* Mockup Dynamic Content */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
              {features[activeFeature].mockupType === 'onboarding' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                    <h5 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#ff6b3d' }}>Step 3 of 4: Finance & Legal Upload</h5>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        📄 Leased_Document.pdf <br /> <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Uploaded</span>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        📄 GST_Certificate.pdf <br /> <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Uploaded</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '11.5px', color: '#34d399', fontWeight: 'bold' }}>onboarding status</span>
                    <span style={{ fontSize: '11px', background: '#10b981', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>90% COMPLETE</span>
                  </div>
                </div>
              )}

              {features[activeFeature].mockupType === 'rates' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Inventory & Dynamic Rates</span>
                  {[
                    { type: "Deluxe Ocean View", price: "₹8,500", status: "Active", rooms: "12 Available" },
                    { type: "Luxury Lagoon Suite", price: "₹15,000", status: "Active", rooms: "4 Available" }
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{row.type}</div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{row.rooms}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>{row.price}</div>
                        <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 5px', borderRadius: '3px' }}>{row.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {features[activeFeature].mockupType === 'analytics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Occupancy</span>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>84.2%</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Est. Revenue</span>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399', marginTop: '2px' }}>₹3.8L</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Avg. Room Rate</span>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#a78bfa', marginTop: '2px' }}>₹8,450</div>
                    </div>
                  </div>
                  {/* Graphical chart visualization */}
                  <div style={{ flexGrow: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>Monthly Booking Trend</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '80px', paddingTop: '10px' }}>
                      {[40, 60, 45, 80, 70, 95, 85].map((h, idx) => (
                        <div key={idx} style={{ width: '22px', height: `${h}%`, background: idx === 5 ? '#e0532b' : '#008cff', borderRadius: '4px 4px 0 0', position: 'relative' }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {features[activeFeature].mockupType === 'promotions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '700' }}>Active Campaign Promos</span>
                  {[
                    { code: "FESTIVE20", value: "20% FLAT DISCOUNT", reach: "All Travelers", color: "#f59e0b" },
                    { code: "BIZCLASS", value: "FREE UPGRADES", reach: "Corporate Customers", color: "#10b981" },
                    { code: "WEEKEND15", value: "15% DISCOUNT", reach: "Friday-Sunday Bookings", color: "#3b82f6" }
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: p.color, color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>{p.code}</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{p.value}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{p.reach}</span>
                    </div>
                  ))}
                </div>
              )}

              {features[activeFeature].mockupType === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '700' }}>Recent Guest Reviews</span>
                    <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 'bold' }}>★ 4.8 / 5.0 Rating</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                      <strong>Rishabh J.</strong>
                      <span>Guest stayed: 2 days ago</span>
                    </div>
                    <p style={{ fontSize: '12.5px', margin: '6px 0 0 0', fontStyle: 'italic', lineHeight: 1.4 }}>
                      "Excellent hospitality and very clean rooms. The staff went out of their way to ensure our check-in process was comfortable."
                    </p>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '10.5px', color: '#34d399', display: 'block', fontWeight: 'bold' }}>Your response:</span>
                    <span style={{ fontSize: '11.5px', color: '#a7f3d0' }}>"Thank you Rishabh! We look forward to welcoming you back soon."</span>
                  </div>
                </div>
              )}

              {features[activeFeature].mockupType === 'payments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '700' }}>Payout Account Ledger</span>
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 'bold' }}>Payout Period: Monthly</span>
                  </div>
                  {[
                    { id: "TXN-88402", date: "08 Aug 2026", amount: "₹48,500", status: "Transferred" },
                    { id: "TXN-88231", date: "01 Aug 2026", amount: "₹1,24,000", status: "Transferred" },
                    { id: "TXN-87980", date: "25 Jul 2026", amount: "₹82,600", status: "Transferred" }
                  ].map((tx, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 'bold' }}>{tx.id}</div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{tx.date}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>{tx.amount}</div>
                        <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold' }}>{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. DIVERSE BUSINESS OFFERINGS */}
      <div style={{ padding: '80px 60px', textAlign: 'center', background: '#ffffff' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 16px 0' }}>
          Sell on all our partner websites and boost revenue <br /> with our diverse business offerings
        </h2>
        <p style={{ fontSize: '15px', color: '#475569', maxWidth: '800px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
          Reach diverse travellers seeking unique stay experiences, like corporate travellers through MyBiz, high-value loyalty program members and more - all from a single, user-friendly platform.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}>
          {[
            {
              title: "MyBiz",
              desc: "Attract travellers from 50,000+ corporates. Highlight relevant business amenities & boost revenue with MyBiz special offers.",
              tag: "Biz",
              tagColor: "#ff4f5a",
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "myPartner Network",
              desc: "Connect with a vast network of 40,000+ travel agents for additional bookings. Reach a wider audience with MyPartner platform!",
              tag: "Partner",
              tagColor: "#008cff",
              image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Loyalty Programs",
              desc: "Loyalty program members on Trip Customizer spend 1.5 times more per booking. Tap into this high-value volume with exclusive benefits.",
              tag: "MMTBlack",
              tagColor: "#1e293b",
              image: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80"
            },
            {
              title: "Homestays, Apartments & Villas",
              desc: "Cater to travellers seeking authentic local experience in unique properties. Host on Trip Customizer & get more bookings.",
              tag: "Stay",
              tagColor: "#e0532b",
              image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'; }}
            >
              <div style={{ position: 'relative', height: '140px' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute', bottom: '12px', right: '12px', background: item.tagColor,
                  color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '800',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>{item.tag}</span>
              </div>
              <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>{item.title}</h4>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. COMPACT PARTNER FOOTER */}
      <footer style={{
        background: '#091c34',
        color: '#94a3b8',
        padding: '40px 60px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'left',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '850', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', marginBottom: '6px' }}>
              ∞ connect
            </span>
            <span>© 2026 Trip Customizer India Private Limited. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Partner Guidelines</span>
            <span style={{ cursor: 'pointer' }}>Help Desk Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
