import React, { useState } from 'react';
import { Briefcase, User, Tag, ChevronDown, Calendar } from 'lucide-react';

export default function Header({ onViewBookings, activeView, onGoHome }) {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  
  const [country, setCountry] = useState('India');
  const [currency, setCurrency] = useState('INR');

  return (
    <header className="main-header" style={{ background: '#0a2240', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 0' }}>
      <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left Side: Brand Logo */}
        <div className="logo-section" onClick={onGoHome} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '2px' }}>
          {/* Customized MMT Logo replication */}
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '24px',
            fontWeight: '900',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '-0.5px'
          }}>
            make
            <span style={{
              background: '#ff4f5a',
              color: '#ffffff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '800',
              margin: '0 4px',
              boxShadow: '0 2px 5px rgba(255,79,90,0.4)'
            }}>
              my
            </span>
            trip
          </div>
        </div>

        {/* Right Side Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          
          {/* MMT Super Offers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b8cc', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            <Tag size={16} style={{ color: '#ff4f5a' }} />
            <div className="header-link-text" style={{ color: '#ffffff' }}>
              <strong>Super Offers</strong>
              <span style={{ display: 'block', fontSize: '10px', color: '#a3b8cc' }}>Explore Great Deals</span>
            </div>
          </div>

          {/* myBiz Business Travel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3b8cc', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
            <Briefcase size={16} style={{ color: '#008cff' }} />
            <div className="header-link-text" style={{ color: '#ffffff' }}>
              <strong>Introducing myBiz</strong>
              <span style={{ display: 'block', fontSize: '10px', color: '#a3b8cc' }}>Corporate Travel Solution</span>
            </div>
          </div>

          {/* My Trips (Booking History Manager) */}
          <div 
            onClick={onViewBookings}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer', 
              fontSize: '13px', 
              fontWeight: '500',
              background: activeView === 'my-bookings' ? 'rgba(0,140,255,0.15)' : 'transparent',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Calendar size={16} style={{ color: '#008cff' }} />
            <div className="header-link-text" style={{ color: '#ffffff' }}>
              <strong>My Trips</strong>
              <span style={{ display: 'block', fontSize: '10px', color: '#a3b8cc' }}>Manage Bookings</span>
            </div>
          </div>

          {/* Country / Currency Selection Toggle */}
          <div style={{ display: 'flex', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
            {/* Country Selector */}
            <div 
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span>🇮🇳 {country === 'India' ? 'IN' : 'US'}</span>
              <ChevronDown size={12} />
              
              {showCountryDropdown && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#ffffff', color: '#1a1a1a', 
                  borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '120px', zIndex: 60, overflow: 'hidden'
                }}>
                  <div onClick={() => { setCountry('India'); setShowCountryDropdown(false); }} style={{ padding: '8px 12px', hover: { background: '#f5f5f5' } }}>🇮🇳 India (IN)</div>
                  <div onClick={() => { setCountry('USA'); setShowCountryDropdown(false); }} style={{ padding: '8px 12px', hover: { background: '#f5f5f5' } }}>🇺🇸 USA (US)</div>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div 
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              <span>{currency}</span>
              <ChevronDown size={12} />

              {showCurrencyDropdown && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#ffffff', color: '#1a1a1a', 
                  borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '100px', zIndex: 60, overflow: 'hidden'
                }}>
                  <div onClick={() => { setCurrency('INR'); setShowCurrencyDropdown(false); }} style={{ padding: '8px 12px' }}>₹ INR</div>
                  <div onClick={() => { setCurrency('USD'); setShowCurrencyDropdown(false); }} style={{ padding: '8px 12px' }}>$ USD</div>
                </div>
              )}
            </div>
          </div>

          {/* Login or Create Account Oval Capsule */}
          <div style={{
            background: 'linear-gradient(90deg, #008cff 0%, #00b4d8 100%)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(0,140,255,0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <User size={14} style={{ color: '#ffffff' }} />
            <span>Login or Create Account</span>
          </div>

        </div>

      </div>
    </header>
  );
}
