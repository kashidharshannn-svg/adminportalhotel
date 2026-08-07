import React, { useState, useEffect } from 'react';
import { 
  connectGetPropertiesForPartner, 
  dbUpdatePropertyDetails, 
  dbDeleteProperty, 
  dbSendChatMessage, 
  dbGetChatMessages 
} from '../data/dbService';
import { LayoutGrid, Mail, PlusCircle, LogOut, ShieldCheck, Home, ArrowRight, CheckCircle2, X, MessageSquare, Paperclip } from 'lucide-react';

export default function ConnectDashboard({ activeUser, onLogout, onStartOnboarding }) {
  const [properties, setProperties] = useState([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState('properties'); // 'properties', 'inbox'

  // Edit Prices & Photos Modal States
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingRooms, setEditingRooms] = useState([]);
  const [editingPhotos, setEditingPhotos] = useState([]);
  const [editingCoverPhoto, setEditingCoverPhoto] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Chatbot Support Widget States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null); // { name, data }

  const loadProperties = async () => {
    try {
      const list = await connectGetPropertiesForPartner(activeUser.uid);
      setProperties(list);
    } catch (err) {
      console.error(err);
    }
  };

  const loadChatMessages = async () => {
    try {
      const msgs = await dbGetChatMessages(activeUser.uid);
      setChatMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProperties();
    loadChatMessages();
    const interval = setInterval(loadChatMessages, 4000);
    return () => clearInterval(interval);
  }, [activeUser]);

  const handleOpenEditModal = (property) => {
    setEditingProperty(property);
    setEditingRooms(JSON.parse(JSON.stringify(property.rooms || [])));
    setEditingPhotos(JSON.parse(JSON.stringify(property.uploadedPhotos || [])));
    setEditingCoverPhoto(property.coverPhoto || '');
    setIsEditModalOpen(true);
  };

  const handlePriceChange = (index, value) => {
    const updated = [...editingRooms];
    updated[index].price = value.replace(/\D/g, ''); // only digits
    setEditingRooms(updated);
  };

  const handleInventoryChange = (index, value) => {
    const updated = [...editingRooms];
    updated[index].count = value.replace(/\D/g, ''); // only digits
    setEditingRooms(updated);
  };

  const handleRemovePhoto = (photoUrl) => {
    const filtered = editingPhotos.filter(url => url !== photoUrl);
    setEditingPhotos(filtered);
    if (editingCoverPhoto === photoUrl) {
      setEditingCoverPhoto(filtered[0] || '');
    }
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingPhotos(prev => {
          const updated = [...prev, event.target.result];
          if (!editingCoverPhoto) {
            setEditingCoverPhoto(event.target.result);
          }
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveChanges = async () => {
    try {
      const hasInvalid = editingRooms.some(r => !r.price || Number(r.price) <= 0);
      if (hasInvalid) {
        alert("Please enter a valid price greater than 0 for all rooms.");
        return;
      }
      if (editingPhotos.length === 0) {
        alert("Please upload/keep at least one property photo.");
        return;
      }
      if (!editingCoverPhoto && editingPhotos.length > 0) {
        await dbUpdatePropertyDetails(editingProperty.id, editingRooms, editingPhotos, editingPhotos[0]);
      } else {
        await dbUpdatePropertyDetails(editingProperty.id, editingRooms, editingPhotos, editingCoverPhoto);
      }
      alert("Property details and configurations updated successfully!");
      setIsEditModalOpen(false);
      setEditingProperty(null);
      loadProperties();
    } catch (err) {
      console.error(err);
      alert("Failed to update property details.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (confirm("Are you sure you want to permanently delete this property? This action cannot be undone.")) {
      try {
        await dbDeleteProperty(propertyId);
        alert("Property deleted successfully!");
        setIsEditModalOpen(false);
        setEditingProperty(null);
        loadProperties();
      } catch (err) {
        console.error(err);
        alert("Failed to delete property.");
      }
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatText.trim()) return;
    try {
      const partnerName = activeUser.name || activeUser.email || 'MMT Partner';
      await dbSendChatMessage(activeUser.uid, 'partner', partnerName, chatText.trim());
      setChatText('');
      loadChatMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChatFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const partnerName = activeUser.name || activeUser.email || 'MMT Partner';
          await dbSendChatMessage(
            activeUser.uid, 
            'partner', 
            partnerName, 
            `Sent a file: ${file.name}`, 
            event.target.result, 
            file.type, 
            file.name
          );
          loadChatMessages();
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewDocument = (doc) => {
    if (doc && doc.data) {
      setPreviewDoc(doc);
    } else {
      alert("No document data available to preview.");
    }
  };

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
                      style={{ 
                        background: '#ffffff', 
                        border: '1px solid' + (prop.status === 'rejected' ? ' #fca5a5' : ' #e6ebf3'), 
                        borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)', position: 'relative' 
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '24px', alignItems: 'center' }}>
                        <img 
                          src={prop.image || prop.coverPhoto || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"} 
                          alt={prop.name} 
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
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
                            {prop.status === 'approved' ? 'Approved' : prop.status === 'rejected' ? 'Rejected' : prop.status}
                          </span>
                          {prop.rooms && prop.rooms[0] && (
                            <div style={{ fontSize: '13px', color: '#1a1a1a' }}>
                              Base price: <strong style={{ fontSize: '15px' }}>₹{Number(prop.rooms[0].price || prop.rooms[0].baseRate || 0).toLocaleString('en-IN')}</strong>
                            </div>
                          )}
                          {true && (
                            <button 
                              onClick={() => handleOpenEditModal(prop)}
                              style={{ 
                                marginTop: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', 
                                color: 'var(--primary-color)', background: 'rgba(0,140,255,0.06)', border: '1px dashed var(--primary-color)',
                                borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' 
                              }}
                            >
                              ⚙️ Edit Price & Photos
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Display rejection reason warning box */}
                      {prop.status === 'rejected' && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 16px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '16px' }}>⚠️</span>
                          <div>
                            <span style={{ color: '#b91c1c', fontWeight: '800', fontSize: '11.5px', display: 'block' }}>Property Verification Rejected by Compliance Support</span>
                            <p style={{ color: '#991b1b', fontSize: '11px', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                              Reason: <strong>"{prop.rejectionReason || 'Uploaded documents require correction. Please edit and re-upload correct credentials.'}"</strong>
                            </p>
                          </div>
                        </div>
                      )}
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

      {/* ================= EDIT PRICE, INVENTORY & PHOTOS MODAL ================= */}
      {isEditModalOpen && editingProperty && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(5, 20, 41, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', textAlign: 'left', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Edit Property & Price Details</h3>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', margin: 0 }}>Property: {editingProperty.name}</p>
              </div>
              <button 
                onClick={() => { setIsEditModalOpen(false); setEditingProperty(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', flexGrow: 1 }}>
              
              {/* SECTION 1: ROOM RATES & INVENTORY */}
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  🔑 Room Rates & Inventory
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {editingRooms.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>No rooms configured.</p>
                  ) : (
                    editingRooms.map((room, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '12px', color: '#334155' }}>
                            🚪 {room.type || room.roomType || `Room Category ${idx + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove the room category "${room.type || `Room Category ${idx + 1}`}"?`)) {
                                setEditingRooms(editingRooms.filter((_, rIdx) => rIdx !== idx));
                              }
                            }}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Base Price (₹)</label>
                            <input 
                              type="text" 
                              value={room.price}
                              onChange={(e) => handlePriceChange(idx, e.target.value)}
                              style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', width: '100%', fontWeight: '600', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Rooms Count (Inventory)</label>
                            <input 
                              type="text" 
                              value={room.count}
                              onChange={(e) => handleInventoryChange(idx, e.target.value)}
                              style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', width: '100%', fontWeight: '600', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 2: MANAGE PHOTOS */}
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📷 Manage Property Photos
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 12px 0' }}>
                  Click a photo to set it as the cover photo. Use the "×" overlay to delete.
                </p>

                {/* Photo Grid */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  {editingPhotos.map((photo, index) => {
                    const isCover = editingCoverPhoto === photo;
                    return (
                      <div 
                        key={index} 
                        style={{
                          width: '76px', height: '76px', position: 'relative', borderRadius: '8px',
                          border: isCover ? '3px solid #10b981' : '1px solid #cbd5e1',
                          boxSizing: 'border-box', cursor: 'pointer', overflow: 'hidden',
                          boxShadow: isCover ? '0 0 8px rgba(16,185,129,0.3)' : 'none'
                        }}
                        onClick={() => setEditingCoverPhoto(photo)}
                      >
                        <img src={photo} alt="property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        {/* Cover Badge */}
                        {isCover && (
                          <span style={{
                            position: 'absolute', bottom: 0, left: 0, width: '100%', background: '#10b981',
                            color: 'white', fontSize: '8px', fontWeight: '800', textAlign: 'center', padding: '1px 0'
                          }}>
                            COVER
                          </span>
                        )}

                        {/* Delete cross button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(photo);
                          }}
                          style={{
                            position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px',
                            borderRadius: '50%', background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                            border: 'none', fontSize: '10px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', fontWeight: '800'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}

                  {/* Add photo square uploader */}
                  <label style={{
                    width: '76px', height: '76px', border: '2px dashed #cbd5e1', borderRadius: '8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', background: '#f8fafc', gap: '4px', boxSizing: 'border-box'
                  }}>
                    <span style={{ fontSize: '18px', color: '#94a3b8', fontWeight: '600' }}>+</span>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#64748b' }}>Add Photo</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleAddPhoto} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <button 
                onClick={() => handleDeleteProperty(editingProperty.id)}
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                🗑️ Delete Property
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setEditingProperty(null); }}
                  style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', color: '#475569', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  style={{ padding: '8px 20px', fontSize: '12px', fontWeight: '700', color: '#ffffff', background: 'linear-gradient(90deg, #ff4f5a 0%, #ff6872 100%)', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255, 79, 90, 0.2)' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING HELP & SUPPORT CHAT BUTTON ================= */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
          borderRadius: '50%', background: '#ff4f5a', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
          boxShadow: '0 8px 24px rgba(255, 79, 90, 0.4)', zIndex: 190000, transition: 'transform 0.2s'
        }}
        title="MMT Support Chatbot"
      >
        <MessageSquare size={24} />
      </button>

      {/* ================= SUPPORT CHAT POPUP WINDOW ================= */}
      {isChatOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', width: '330px', height: '440px',
          background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', zIndex: 195000,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left'
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(90deg, #ff4f5a 0%, #ff6872 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h5 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>MakeMyTrip Connect Support</h5>
              <span style={{ fontSize: '9px', color: '#ffe4e6', marginTop: '2px', display: 'block' }}>We respond in real-time</span>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: '800' }}
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Log */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
            {/* System welcome message if no history exists */}
            {chatMessages.length === 0 && (
              <div style={{
                alignSelf: 'flex-start', maxWidth: '85%', background: '#ffffff',
                border: '1px solid #e2e8f0', color: '#1e293b', padding: '8px 12px',
                borderRadius: '12px', borderBottomLeftRadius: '2px', fontSize: '11px', lineHeight: 1.4
              }}>
                <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>MMT Support Assistant</span>
                Hi there! Welcome to the MakeMyTrip onboarding help desk. How can we help you resolve pricing updates, compliance documents, or approvals?
              </div>
            )}

            {chatMessages.map((msg, index) => {
              const isMe = msg.senderRole === 'partner';
              return (
                <div 
                  key={index} 
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: isMe ? '#ff4f5a' : '#ffffff',
                    border: isMe ? 'none' : '1px solid #e2e8f0',
                    color: isMe ? '#ffffff' : '#1e293b',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    borderBottomRightRadius: isMe ? '2px' : '12px',
                    borderBottomLeftRadius: isMe ? '12px' : '2px',
                    fontSize: '11px',
                    lineHeight: 1.4,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <span style={{ fontSize: '8px', opacity: 0.8, display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
                    {msg.senderName}
                  </span>
                  {msg.text}

                  {/* Shared Attachments rendering */}
                  {msg.fileData && (
                    <div style={{ marginTop: '6px' }}>
                      {msg.fileType?.startsWith('image/') ? (
                        <img 
                          src={msg.fileData} 
                          alt={msg.fileName}
                          onClick={() => handlePreviewDocument({ name: msg.fileName, data: msg.fileData })}
                          style={{ maxWidth: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px', cursor: 'pointer', border: '1px solid #cbd5e1' }}
                        />
                      ) : msg.fileType?.startsWith('video/') ? (
                        <video 
                          src={msg.fileData} 
                          controls 
                          style={{ maxWidth: '100%', maxHeight: '140px', borderRadius: '6px' }}
                        />
                      ) : (
                        <div 
                          onClick={() => handlePreviewDocument({ name: msg.fileName, data: msg.fileData })}
                          style={{
                            background: 'rgba(0,140,255,0.05)', border: '1px dashed rgba(0,140,255,0.2)',
                            padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>📄</span>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#ff4f5a', display: 'block' }}>{msg.fileName}</span>
                            <span style={{ fontSize: '8px', color: '#64748b' }}>Click to view document</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input Footer */}
          <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Attachment Button */}
            <button 
              type="button"
              onClick={() => document.getElementById('partner-chat-file-input').click()}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', color: '#64748b' }}
              title="Attach Photo / Video / PDF"
            >
              <Paperclip size={18} />
            </button>
            <input 
              id="partner-chat-file-input"
              type="file"
              accept="image/*,video/*,application/pdf"
              style={{ display: 'none' }}
              onChange={handleSendChatFile}
            />

            <input 
              type="text"
              placeholder="Ask support a question..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
              style={{
                flexGrow: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px',
                fontSize: '11.5px', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <button 
              onClick={handleSendChatMessage}
              style={{
                background: '#ff4f5a', border: 'none', color: '#ffffff', fontWeight: '700',
                padding: '8px 14px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      {previewDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff', width: '100%', maxWidth: '700px', borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', height: '80vh'
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Document Preview</h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>File: {previewDoc.name}</p>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '13px', fontWeight: '800' }}
              >
                ✕ Close
              </button>
            </div>
            {/* Viewer */}
            <div style={{ flexGrow: 1, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'auto' }}>
              {previewDoc.data && previewDoc.data.startsWith('data:application/pdf') ? (
                <iframe 
                  src={previewDoc.data} 
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }} 
                  title="PDF Document"
                />
              ) : (
                <img 
                  src={previewDoc.data} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
