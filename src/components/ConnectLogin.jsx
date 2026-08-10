import React, { useState, useEffect } from 'react';
import { connectLoginPartner, connectRegisterPartner } from '../data/dbService';
import { Mail, Lock, User, Check, ChevronDown, ChevronUp, Download, CheckCircle2, ArrowRight, ArrowLeft, Smartphone } from 'lucide-react';

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
      description: "Attract bookings with promotions & offers to stay ahead of competition.",
      mockupType: "promotions"
    },
    {
      title: "Guest reviews & ratings",
      description: "View and analyse guest feedback to improve, and enhance satisfaction.",
      mockupType: "reviews"
    },
    {
      title: "Simplified payments",
      description: "Receive timely payouts for your bookings with easy-to-track records.",
      mockupType: "payments"
    }
  ];

  // 3. Testimonials / Success Stories Slider State
  const [activeStory, setActiveStory] = useState(0);
  const successStories = [
    {
      quote: "Being the market leader in the domestic market, Trip Customizer has been helpful for overall revenue maximization. Top features that helped us in the long term include key growth recommendations, matchless support by the market managers, and transparency in billing & payment terms.",
      author: "Piyush R. Samantaray",
      role: "AGM- Revenue | MAYFAIR Hotels & Resorts (associated since 2008)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      quote: "Trip Customizer Connect Extranet has completely transformed how we handle last-minute room distributions. The dynamic promotions and instant check-in notifications keep our occupancy high and help us maintain full control over pricing strategy.",
      author: "Neha Sharma",
      role: "General Manager | Elite Stay Residences (associated since 2020)",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // 4. Interactive FAQs accordion state
  const [openFaq, setOpenFaq] = useState(4); // Default to "When will my property be listed online?" open to match screenshots
  const faqs = [
    {
      question: "Do I need to sign up for each Trip Customizer brand separately?",
      answer: "No, a single registration on Partner Connect lists your property across all our distribution networks including Trip Customizer, B2C search index, and partner affiliate websites automatically."
    },
    {
      question: "How much commission does Trip Customizer charge?",
      answer: "Listing your property is completely free. We charge a standard competitive commission rate only on successful, checked-in bookings. No hidden monthly maintenance or listing fees."
    },
    {
      question: "How can I add photos to my property?",
      answer: "Once logged in to your partner console, navigate to 'My Properties' and click 'Edit Price & Photos'. You can upload up to 10 compressed photos with room category tags."
    },
    {
      question: "How do Trip Customizer payments work?",
      answer: "For 'Pay at Hotel' bookings, guests pay you directly at checkout. For 'Prepaid' bookings, payout settlements are credited automatically into your registered bank account on the guest's check-in date."
    },
    {
      question: "When will my property be listed online?",
      answer: "After you finish creating your listing, it goes through a quality check and validation. Your property will go online in about 5-7 working days on our site. In the meantime, explore our extranet platform and get ready to welcome your first guests!"
    },
    {
      question: "Can I list my property with Trip Customizer if I already work with other online travel agents (OTAs)?",
      answer: "Yes, you can easily list with us. You can connect your existing Channel Manager to avoid double-bookings and sync live rates/inventories in real-time."
    },
    {
      question: "Can I list my house on Trip Customizer?",
      answer: "Yes, we support homestays, apartments, villas, cottages, and alternative accommodations under our Homestays & Villas category."
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>Features</span>
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
          { stat: "100% Free Listing", desc: "Zero onboarding fees. List your hotel, homestay, resort, or apartment with absolutely no hidden monthly charges or setup costs." },
          { stat: "Direct Settlements", desc: "Payouts are transferred directly into your registered bank account on the day of guest check-in without delays." },
          { stat: "24x7 Partner Support", desc: "Get dedicated real-time chat support and interactive guidelines to resolve all compliance uploads and partner queries." }
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

      {/* 4. FEATURES ACCORDION & LAYERED HIGH-FIDELITY CSS MOCKUPS */}
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

          {/* Right Live Layered Mockup */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            
            {/* Tablet Mockup (Back Layer) */}
            <div style={{
              width: '420px',
              height: '310px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '10px solid #1e293b',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              right: '10px',
              bottom: '30px',
              zIndex: 1,
              overflow: 'hidden'
            }}>
              {/* Tablet Browser bar */}
              <div style={{ background: '#0f172a', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '10px', fontWeight: 'bold' }}>Trip Customizer Connect</span>
                </div>
                <span style={{ fontSize: '9px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>TABLET VIEW</span>
              </div>

              {/* Tablet View Screen */}
              <div style={{ flexGrow: 1, padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {features[activeFeature].mockupType === 'onboarding' && (
                  <div style={{ textAlign: 'left' }}>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>Which property type would you like to list?</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ border: '2px solid #e0532b', background: '#fff7f5', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#e0532b' }}>Hotel</div>
                        <span style={{ fontSize: '9px', color: '#64748b' }}>Stays with room-level booking & configurations</span>
                      </div>
                      <div style={{ border: '1px solid #cbd5e1', background: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#334155' }}>Homestays & Villas</div>
                        <span style={{ fontSize: '9px', color: '#64748b' }}>Entire villa/cottages listed as full occupancy stays</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>Type of Hotel</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {["Resort", "Lodge", "Guest House"].map((type, i) => (
                        <div key={i} style={{ border: '1px solid #e2e8f0', background: '#ffffff', padding: '6px', borderRadius: '4px', textAlign: 'center', fontSize: '10px', fontWeight: '700' }}>
                          🏨 {type}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'rates' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>Manage Inventory & Rates</h5>
                    
                    {/* Fake Calendar Spreadsheet Grid */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: '#ffffff' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(4, 1fr)', background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', fontSize: '9px', fontWeight: 'bold', textAlign: 'center', padding: '6px 0' }}>
                        <div style={{ textAlign: 'left', paddingLeft: '8px' }}>Room Categories</div>
                        <div>Fri 12 May</div>
                        <div>Sat 13 May</div>
                        <div>Sun 14 May</div>
                        <div>Mon 15 May</div>
                      </div>
                      {[
                        { name: "Deluxe Ocean View", val: ["3 Sold", "₹8,500", "₹8,500", "₹8,500"] },
                        { name: "Luxury Lagoon Suite", val: ["Blocked", "₹15,000", "₹15,000", "₹15,000"] }
                      ].map((row, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr repeat(4, 1fr)', borderBottom: idx === 0 ? '1px solid #e2e8f0' : 'none', fontSize: '9.5px', textAlign: 'center', padding: '8px 0', alignItems: 'center' }}>
                          <div style={{ textAlign: 'left', paddingLeft: '8px', fontWeight: 'bold', fontSize: '8.5px' }}>{row.name}</div>
                          {row.val.map((cell, cidx) => {
                            const isStatus = cidx === 0;
                            const isGreen = cell.startsWith('₹');
                            return (
                              <div key={cidx} style={{ 
                                color: isStatus ? (cell === 'Blocked' ? '#ef4444' : '#10b981') : (isGreen ? '#047857' : '#ef4444'),
                                background: isGreen ? '#d1fae5' : 'transparent',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                fontSize: '8.5px',
                                fontWeight: 'bold',
                                margin: '0 4px'
                              }}>
                                {cell}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'analytics' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>Performance Overview</h5>
                      <span style={{ fontSize: '8px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>Last 30 Days</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {[
                        { title: "Revenue", val: "₹21.7L", color: "#10b981" },
                        { title: "ASP", val: "₹5,250", color: "#6366f1" },
                        { title: "Visits", val: "9,898", color: "#0ea5e9" },
                        { title: "Conv. Rate", val: "2.75%", color: "#f59e0b" }
                      ].map((card, i) => (
                        <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '7.5px', color: '#64748b', textTransform: 'uppercase' }}>{card.title}</div>
                          <div style={{ fontSize: '11px', fontWeight: '850', color: card.color, marginTop: '2px' }}>{card.val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chart section */}
                    <div style={{ flexGrow: 1, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90px' }}>
                      <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>Your Property vs Competitors Avg Booking Nights</span>
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '60px' }}>
                        {[
                          { y: 60, c: 50 },
                          { y: 80, c: 65 },
                          { y: 75, c: 70 },
                          { y: 95, c: 80 }
                        ].map((bar, i) => (
                          <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                            <div style={{ width: '10px', height: `${bar.y}px`, background: '#008cff', borderRadius: '2px 2px 0 0' }} />
                            <div style={{ width: '10px', height: `${bar.c}px`, background: '#f16825', borderRadius: '2px 2px 0 0' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'promotions' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h5 style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>Active Promotions Campaign</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <span style={{ fontSize: '8px', background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>RECOMMENDED</span>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '6px' }}>Basic Promotion</div>
                        <p style={{ fontSize: '9px', color: '#64748b', margin: '4px 0 8px 0', lineHeight: 1.3 }}>Offer custom flat discounts to boost booking velocity</p>
                        <button style={{ background: '#e0532b', border: 'none', color: '#ffffff', fontSize: '9px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Create</button>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                        <span style={{ fontSize: '8px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>HIGH IMPACT</span>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '6px' }}>Long Stay Promo</div>
                        <p style={{ fontSize: '9px', color: '#64748b', margin: '4px 0 8px 0', lineHeight: 1.3 }}>Give deeper discounts to guests staying 3+ nights</p>
                        <button style={{ background: '#e0532b', border: 'none', color: '#ffffff', fontSize: '9px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Create</button>
                      </div>
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'reviews' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h5 style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>Ratings & Reviews Breakdown</h5>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {/* Left Column (MMT Ratings) */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#008cff' }}>MakeMyTrip</span>
                          <span style={{ fontSize: '11px', fontWeight: '900', color: '#008cff' }}>4.5 ★</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                          {["Hospitality", "Cleanliness", "Location"].map((metric, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px' }}>
                              <span>{metric}</span>
                              <span style={{ fontWeight: 'bold' }}>4.6</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column (Goibibo Ratings) */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#f16825' }}>Goibibo</span>
                          <span style={{ fontSize: '11px', fontWeight: '900', color: '#f16825' }}>4.5 ★</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                          {["Hospitality", "Amenities", "Value for Money"].map((metric, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px' }}>
                              <span>{metric}</span>
                              <span style={{ fontWeight: 'bold' }}>4.5</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'payments' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h5 style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontWeight: '800' }}>GSTN Invoice Details</h5>
                    
                    <div style={{ background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>📤</span>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#334155', display: 'block' }}>Drag & Drop Invoices</span>
                      <span style={{ fontSize: '8px', color: '#64748b', marginTop: '2px', display: 'block' }}>Or Click Here to upload your monthly property GST tax invoices (PDF/JPG)</span>
                    </div>

                    <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '6px 10px', borderRadius: '6px', fontSize: '8.5px', color: '#b45309', lineHeight: 1.3 }}>
                      ℹ️ Monthly payout invoice details must contain correct Booking IDs, corporate check-ins, and tax slabs.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Mockup (Front Layer) */}
            <div style={{
              width: '180px',
              height: '330px',
              background: '#0f172a',
              borderRadius: '24px',
              border: '8px solid #0f172a',
              boxShadow: '0 25px 35px -5px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              left: '20px',
              bottom: '10px',
              zIndex: 2,
              overflow: 'hidden'
            }}>
              {/* Phone Speaker notch */}
              <div style={{ height: '14px', background: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '40px', height: '4px', background: '#334155', borderRadius: '2px' }} />
              </div>

              {/* Phone View Screen */}
              <div style={{ flexGrow: 1, padding: '10px', background: '#ffffff', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {features[activeFeature].mockupType === 'onboarding' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>onboarding status</div>
                    <span style={{ fontSize: '10px', fontWeight: '850', color: '#0f172a' }}>Type of property</span>
                    
                    {[
                      { name: "Hotel", isSel: true },
                      { name: "Homestay", isSel: false },
                      { name: "Resort", isSel: false },
                      { name: "Apartment", isSel: false }
                    ].map((row, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center',
                        border: row.isSel ? '1px solid #e0532b' : '1px solid #cbd5e1',
                        background: row.isSel ? '#fff7f5' : 'transparent',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        fontSize: '9.5px',
                        fontWeight: 'bold',
                        color: row.isSel ? '#e0532b' : '#475569'
                      }}>
                        <span>🏨 {row.name}</span>
                        {row.isSel && <span style={{ fontSize: '8px' }}>✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {features[activeFeature].mockupType === 'rates' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Active Room rates</div>
                    <span style={{ fontSize: '10px', fontWeight: '850', color: '#0f172a' }}>Chateau de Vasco</span>
                    
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 'bold' }}>Deluxe King Room</span>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '850', color: '#047857' }}>₹1,271</span>
                        <span style={{ fontSize: '7px', background: '#d1fae5', color: '#065f46', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>Active</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: '#fff7f5', border: '1px solid #fee2e2', padding: '6px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '8.5px', color: '#e0532b', fontWeight: 'bold' }}>Hourly Stays</span>
                      <div style={{ width: '18px', height: '10px', background: '#10b981', borderRadius: '10px', position: 'relative' }}>
                        <div style={{ width: '8px', height: '8px', background: '#white', borderRadius: '50%', position: 'absolute', right: '1px', top: '1px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'analytics' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Performance Overview</div>
                    <span style={{ fontSize: '10px', fontWeight: '850', color: '#0f172a' }}>Le Mission Stay</span>

                    {[
                      { l: "Room Nights", v: "7", c: "#3b82f6" },
                      { l: "Revenue", v: "₹4,800", c: "#10b981" },
                      { l: "Check-ins", v: "6", c: "#f59e0b" },
                      { l: "Occupancy", v: "82%", c: "#8b5cf6" }
                    ].map((metric, i) => (
                      <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '5px 8px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '8.5px', color: '#64748b' }}>{metric.l}</span>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: metric.c }}>{metric.v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {features[activeFeature].mockupType === 'promotions' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>active offers</div>
                    <span style={{ fontSize: '10px', fontWeight: '850', color: '#0f172a' }}>Promos & Coupons</span>

                    <div style={{ border: '1px dashed #f59e0b', background: '#fffbeb', padding: '8px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '9px', fontWeight: '900', color: '#d97706' }}>EARLYBIRD30</div>
                      <span style={{ fontSize: '8.5px', fontWeight: 'bold' }}>30% Discount Code</span>
                      <span style={{ fontSize: '7.5px', color: '#64748b' }}>Applicable 15 days before check-in</span>
                    </div>

                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                      <span>Active: 3 Campaigns</span>
                      <span style={{ color: '#008cff', fontWeight: 'bold', cursor: 'pointer' }}>View All</span>
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'reviews' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Traveller Impressions</div>
                    <span style={{ fontSize: '10px', fontWeight: '850', color: '#0f172a' }}>Ratings & Reviews</span>

                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: '950', color: '#f59e0b' }}>4.3 ★</div>
                      <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: 'bold' }}>120 Ratings</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {[
                        { label: "Excellent", pct: 65, color: "#10b981" },
                        { label: "Very Good", pct: 20, color: "#3b82f6" },
                        { label: "Average", pct: 10, color: "#f59e0b" },
                        { label: "Poor", pct: 5, color: "#ef4444" }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '8px' }}>
                          <span style={{ width: '40px', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.label}</span>
                          <div style={{ flexGrow: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 4px', position: 'relative' }}>
                            <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '2px' }} />
                          </div>
                          <span style={{ width: '20px', textAlign: 'right' }}>{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {features[activeFeature].mockupType === 'payments' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>ledger details</div>
                    <span style={{ fontSize: '10px', fontWeight: '850', color: '#0f172a' }}>Price Breakup</span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', background: '#f8fafc', padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '8px' }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                        <span>Room Charges</span>
                        <span style={{ fontWeight: 'bold' }}>₹6,540.75</span>
                      </div>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                        <span>Extra Adult Charges</span>
                        <span style={{ fontWeight: 'bold' }}>₹0.00</span>
                      </div>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                        <span>GST @ 18%</span>
                        <span style={{ fontWeight: 'bold' }}>₹1,177.33</span>
                      </div>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '3px', marginTop: '3px', color: '#e0532b', fontWeight: 'bold' }}>
                        <span>Total Payable</span>
                        <span>₹7,718.08</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SUCCESS STORIES / TESTIMONIAL SLIDER */}
      <div style={{ padding: '80px 60px', background: '#ffffff', textAlign: 'left' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: '#e0532b', textTransform: 'uppercase', letterSpacing: '1px' }}>Success Stories</span>
        <h2 style={{ fontSize: '32px', fontWeight: '850', color: '#0f172a', margin: '8px 0 40px 0' }}>What our partners say</h2>

        <div style={{
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: window.innerWidth < 850 ? '30px 20px' : '50px',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 850 ? '1fr' : '1.5fr 1fr',
          gap: '40px',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Quote content */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', height: '100%' }}>
            <div>
              <p style={{
                fontSize: window.innerWidth < 850 ? '16px' : '20px',
                lineHeight: '1.6',
                color: '#334155',
                fontWeight: '500',
                margin: 0
              }}>
                "{successStories[activeStory].quote}"
              </p>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '24px 0 4px 0' }}>
                — {successStories[activeStory].author}
              </h4>
              <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>
                {successStories[activeStory].role}
              </span>
            </div>

            {/* Slider navigation */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button 
                onClick={() => setActiveStory(prev => (prev - 1 + successStories.length) % successStories.length)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#475569', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
              >
                <ArrowLeft size={16} />
              </button>
              <button 
                onClick={() => setActiveStory(prev => (prev + 1) % successStories.length)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #cbd5e1',
                  background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#475569', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Testimonial Image */}
          <div style={{ height: '280px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <img 
              src={successStories[activeStory].image} 
              alt={successStories[activeStory].author}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </div>

      {/* 6. DIVERSE BUSINESS OFFERINGS */}
      <div style={{ padding: '80px 60px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 16px 0' }}>
          Sell on all our partner websites and boost revenue <br /> with our diverse business offerings
        </h2>
        <p style={{ fontSize: '15px', color: '#475569', maxWidth: '800px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
          Reach diverse travellers seeking unique stay experiences, like corporate travellers through MyBiz, high-value loyalty program members and more - all from a single, user-friendly platform.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 850 ? '1fr' : 'repeat(4, 1fr)',
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

      {/* 7. FREQUENTLY ASKED QUESTIONS SECTION */}
      <div style={{ padding: '80px 60px', background: '#ffffff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px 0' }}>Frequently asked questions</h2>
        <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '40px' }}>Help section for partners, hosts & property owners</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '850px', margin: '0 auto', textAlign: 'left' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                style={{
                  background: '#ffffff',
                  border: isOpen ? '1px solid #e0532b' : '1px solid #f1f5f9',
                  borderRadius: '12px',
                  padding: '24px 30px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: isOpen ? '#e0532b' : '#1e293b' }}>
                    {faq.question}
                  </span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: '#fff7f5',
                    display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0
                  }}>
                    {isOpen ? <ChevronUp size={18} color="#e0532b" style={{ margin: 'auto' }} /> : <ChevronDown size={18} color="#e0532b" style={{ margin: 'auto' }} />}
                  </div>
                </div>
                {isOpen && (
                  <p style={{ fontSize: '14.5px', color: '#475569', marginTop: '16px', margin: '16px 0 0 0', lineHeight: '1.6', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button style={{
          background: '#e0532b', color: '#ffffff', border: 'none', padding: '12px 28px',
          borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          marginTop: '40px', boxShadow: '0 4px 6px -1px rgba(224, 83, 43, 0.2)'
        }}>
          Read all FAQs
        </button>
      </div>

      {/* 9. EXTENDED BRAND DIRECTORY FOOTER */}
      <footer style={{
        background: '#2d3033',
        color: '#a3b2c2',
        padding: '60px 40px 30px 40px',
        textAlign: 'left'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Brand header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '30px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: '850', color: '#ffffff' }}>∞ connect</span>
              <span style={{ fontSize: '11px', color: '#a3b2c2', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Formerly InGo</span>
            </div>
          </div>

          {/* Directory Links Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 850 ? '1fr' : 'repeat(4, 1fr)',
            gap: '40px',
            fontSize: '13px',
            lineHeight: '1.8'
          }}>
            {/* Col 1 */}
            <div>
              <h5 style={{ color: '#ffffff', fontWeight: '800', fontSize: '13px', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>About Us</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {["About Us", "Investor Relations", "Trip Customizer Foundation", "CSR Policy", "Legal Notices", "Privacy Policy", "Terms & Conditions"].map((link, i) => (
                  <span key={i} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ffffff'} onMouseOut={e => e.currentTarget.style.color = '#a3b2c2'}>{link}</span>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h5 style={{ color: '#ffffff', fontWeight: '800', fontSize: '13px', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Our Sales Channel</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {["Trip Customizer", "Goibibo", "Redbus", "myBiz for Corporate Travel", "Partner Connect Portal", "Advertise with Us", "BookMyForex"].map((link, i) => (
                  <span key={i} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ffffff'} onMouseOut={e => e.currentTarget.style.color = '#a3b2c2'}>{link}</span>
                ))}
              </div>
            </div>

            {/* Col 3 */}
            <div>
              <h5 style={{ color: '#ffffff', fontWeight: '800', fontSize: '13px', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Links</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {["List your Homestay on Trip Customizer", "List your Hotel on Trip Customizer", "List your Villa on Trip Customizer", "List your Apartment on Trip Customizer", "Partner Help & Support", "Trip Customizer Partner Community"].map((link, i) => (
                  <span key={i} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#ffffff'} onMouseOut={e => e.currentTarget.style.color = '#a3b2c2'}>{link}</span>
                ))}
              </div>
            </div>

            {/* Col 4 */}
            <div>
              <h5 style={{ color: '#ffffff', fontWeight: '800', fontSize: '13px', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</h5>
              <p style={{ color: '#a3b2c2', margin: 0, fontSize: '12.5px', lineHeight: '1.6' }}>
                RTO Office transport nagar, <br />
                Ayodhya, Uttar Pradesh
              </p>
            </div>
          </div>

          {/* Copyright line */}
          <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
            © 2026 Trip Customizer India Private Limited. All rights reserved. Registered under Trip Customizer Partner Network.
          </div>
        </div>
      </footer>
    </div>
  );
}
