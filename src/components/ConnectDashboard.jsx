import React, { useState, useEffect } from 'react';
import { connectGetPropertiesForPartner } from '../data/dbService';
import { LayoutGrid, Mail, PlusCircle, LogOut, ShieldCheck, Home, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ConnectDashboard({ activeUser, onLogout, onStartOnboarding }) {
  const [properties, setProperties] = useState([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('properties'); // 'properties', 'inbox'

  const loadProperties = async () => {
    try {
      const list = await connectGetPropertiesForPartner(activeUser.uid);
      setProperties(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [activeUser]);

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header style={{ background: '#ffffff', padding: '14px 40px', borderBottom: '1px solid #e6ebf3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ∞ connect
          </span>
          <span style={{ background: '#e0f2fe', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase' }}>
            MMT & Goibibo Partner Console
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e6ff', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
              {activeUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              Hi, <strong>{activeUser.name}</strong>
            </div>
          </div>

          <button 
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', background: '#ffffff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </header>

      {/* Workspace Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', flexGrow: 1 }}>
        
        {/* Left Sidebar */}
        <aside style={{ background: '#ffffff', borderRight: '1px solid #e6ebf3', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <button
            onClick={() => setActiveSidebarTab('properties')}
            style={{
              width: '100%', padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', border: 'none', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              background: activeSidebarTab === 'properties' ? 'rgba(0,140,255,0.08)' : 'transparent',
              color: activeSidebarTab === 'properties' ? 'var(--primary-color)' : '#475569'
            }}
          >
            <LayoutGrid size={16} />
            My Properties
          </button>

          <button
            onClick={() => setActiveSidebarTab('inbox')}
            style={{
              width: '100%', padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', border: 'none', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              background: activeSidebarTab === 'inbox' ? 'rgba(0,140,255,0.08)' : 'transparent',
              color: activeSidebarTab === 'inbox' ? 'var(--primary-color)' : '#475569'
            }}
          >
            <Mail size={16} />
            Group Inbox
          </button>

          <button
            onClick={onStartOnboarding}
            style={{
              width: '100%', padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', border: 'none', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '20px',
              background: 'var(--primary-color)', color: 'white', boxShadow: '0 4px 10px rgba(0,140,255,0.2)'
            }}
          >
            <PlusCircle size={16} />
            Add Property
          </button>
        </aside>

        {/* Right Dashboard Body */}
        <main style={{ padding: '40px', textAlign: 'left', overflowY: 'auto' }}>
          
          {/* TAB 1: PROPERTIES LIST */}
          {activeSidebarTab === 'properties' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', color: '#1a1a1a' }}>My Registered Properties</h2>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>List of all accommodations registered under your partner account</p>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>
                  Total: {properties.length}
                </span>
              </div>

              {properties.length === 0 ? (
                /* Empty state */
                <div style={{ border: '2px dashed #cbd5e1', padding: '60px', borderRadius: '12px', background: '#ffffff', textAlign: 'center', maxWidth: '600px', margin: '40px auto 0 auto' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
                  <h4 style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a1a' }}>No properties onboarded yet</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', maxWidth: '380px', margin: '6px auto 20px auto', lineHeight: 1.5 }}>
                    Onboard your hotel, homestay, or resort on MakeMyTrip Connect to start accepting customer bookings.
                  </p>
                  <button onClick={onStartOnboarding} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={16} />
                    Onboard Your First Property
                  </button>
                </div>
              ) : (
                /* Properties list grid */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {properties.map((prop) => (
                    <div 
                      key={prop.id} 
                      style={{ background: '#ffffff', border: '1px solid #e6ebf3', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '24px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                    >
                      <img src={prop.image} alt={prop.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary-color)', background: 'rgba(0,140,255,0.08)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {prop.propertyType} • {prop.subType}
                        </span>
                        <h4 style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a1a', marginTop: '6px' }}>{prop.name}</h4>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Location: <strong>{prop.city}</strong> • Built Year: {prop.yearBuilt} • Channel Manager: {prop.channelManager}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <span style={{ 
                          background: prop.status === 'approved' ? '#d1fae5' : prop.status === 'Pending Review' ? '#fffbeb' : '#fee2e2', 
                          color: prop.status === 'approved' ? '#065f46' : prop.status === 'Pending Review' ? '#b45309' : '#991b1b', 
                          fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' 
                        }}>
                          <CheckCircle2 size={12} />
                          {prop.status}
                        </span>
                        {prop.rooms && prop.rooms[0] && (
                          <div style={{ fontSize: '13px', color: '#1a1a1a' }}>
                            Base price: <strong style={{ fontSize: '15px' }}>₹{Number(prop.rooms[0].price || prop.rooms[0].baseRate || 0).toLocaleString('en-IN')}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GROUP INBOX */}
          {activeSidebarTab === 'inbox' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', color: '#1a1a1a', marginBottom: '24px' }}>Group Inbox</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '750px' }}>
                <div style={{ background: 'white', border: '1px solid #e6ebf3', borderRadius: '8px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '20px' }}>🔔</div>
                  <div>
                    <h5 style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a' }}>Listing Verification Approved</h5>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                      Congratulations! Your property "Grand Candolim Palace & Spa" has completed verification and is now active on the public search index.
                    </p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '6px' }}>Received: 2 Hours Ago</span>
                  </div>
                </div>

                <div style={{ background: 'white', border: '1px solid #e6ebf3', borderRadius: '8px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '20px' }}>💬</div>
                  <div>
                    <h5 style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a' }}>Guest Query - Booking PNR MMT9834</h5>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                      Guest "Rishabh Jaiswal" requested early check-in at 10:00 AM on 12 Sep 2026. Please respond within 4 hours.
                    </p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '6px' }}>Received: 5 Hours Ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
