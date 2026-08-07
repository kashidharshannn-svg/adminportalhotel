import React, { useState, useEffect } from 'react';
import { 
  dbGetAdminListings, 
  dbUpdateListingStatus, 
  dbSendChatMessage, 
  dbGetChatMessages, 
  dbGetAllChatsForAdmin 
} from '../data/dbService';
import { ShieldCheck, LogOut, Check, X, Building, MapPin, Eye, FileText, ArrowRight, MessageSquare, Paperclip } from 'lucide-react';

export default function AdminConsole({ activeUser, onLogout }) {
  const [pendingListings, setPendingListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  // Status Tab selection
  const [activeStatusTab, setActiveStatusTab] = useState('Pending Review'); // 'Pending Review', 'approved', 'rejected'

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null); // { name, data }

  // Admin Chat Support States
  const [isAdminChatOpen, setIsAdminChatOpen] = useState(false);
  const [allChatMessages, setAllChatMessages] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');
  const [adminChatText, setAdminChatText] = useState('');

  const loadListings = async () => {
    try {
      const list = await dbGetAdminListings(activeStatusTab);
      setPendingListings(list);
      // Auto-select listing in current view
      if (list.length > 0) {
        if (!selectedListing || selectedListing.status !== activeStatusTab) {
          setSelectedListing(list[0]);
        }
      } else {
        setSelectedListing(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAdminChats = async () => {
    try {
      const msgs = await dbGetAllChatsForAdmin();
      setAllChatMessages(msgs);
    } catch (err) {
      console.error("Error loading admin chats", err);
    }
  };

  useEffect(() => {
    loadListings();
  }, [activeStatusTab]);

  useEffect(() => {
    loadAdminChats();
    const interval = setInterval(loadAdminChats, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (propertyId, status, rejectionReason = '') => {
    try {
      await dbUpdateListingStatus(propertyId, 'Hotel', status, rejectionReason);
      alert(`Property has been ${status === 'approved' ? 'Approved & Listed live! ✅' : 'Rejected. ❌'}`);
      loadListings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    if (!selectedListing) return;
    const reason = prompt("Enter Rejection Reason (e.g. Invalid document files, incorrect price rates, etc.):");
    if (reason === null) return; // cancelled
    if (!reason.trim()) {
      alert("Rejection reason is required!");
      return;
    }
    await handleAction(selectedListing.id, 'rejected', reason.trim());
  };

  const handleSendAdminReply = async () => {
    if (!adminChatText.trim() || !selectedPartnerId) return;
    try {
      await dbSendChatMessage(selectedPartnerId, 'admin', 'MMT Admin Support', adminChatText.trim());
      setAdminChatText('');
      loadAdminChats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAdminFile = (e) => {
    if (e.target.files && e.target.files[0] && selectedPartnerId) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          await dbSendChatMessage(
            selectedPartnerId, 
            'admin', 
            'MMT Admin Support', 
            `Sent a file: ${file.name}`, 
            event.target.result, 
            file.type, 
            file.name
          );
          loadAdminChats();
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

  // Group messages by partnerId
  const chatGroups = allChatMessages.reduce((groups, msg) => {
    if (!groups[msg.partnerId]) {
      groups[msg.partnerId] = {
        partnerId: msg.partnerId,
        partnerName: msg.senderRole === 'partner' ? msg.senderName : 'Partner Support Request',
        lastMessage: msg.text,
        timestamp: msg.timestamp,
        messages: []
      };
    }
    groups[msg.partnerId].messages.push(msg);
    if (msg.senderRole === 'partner') {
      groups[msg.partnerId].partnerName = msg.senderName;
    }
    if (msg.timestamp > groups[msg.partnerId].timestamp) {
      groups[msg.partnerId].lastMessage = msg.text;
      groups[msg.partnerId].timestamp = msg.timestamp;
    }
    return groups;
  }, {});

  const chatGroupList = Object.values(chatGroups).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div style={{ background: '#091522', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#f8fafc' }}>
      
      {/* Admin Navbar */}
      <header style={{ background: '#0a1d30', borderBottom: '1px solid #1e293b', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ∞ connect
          </span>
          <span style={{ background: '#f59e0b', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Admin Approvals Console
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: '#94a3b8' }}>Logged in as:</span>
            <strong>{activeUser.name} ({activeUser.email})</strong>
          </div>
          <button 
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '750', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <LogOut size={12} />
            Exit Admin Desk
          </button>
        </div>
      </header>

      {/* Main Approval Grid workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flexGrow: 1, minHeight: 'calc(100vh - 61px)' }}>
        
        {/* Left Column: Properties Queue list */}
        <aside style={{ background: '#071625', borderRight: '1px solid #1e293b', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#f8fafc', textTransform: 'uppercase', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '4px', textAlign: 'left' }}>
            Registration Queue ({pendingListings.length})
          </h4>

          {/* Status Tabs Header */}
          <div style={{ display: 'flex', gap: '4px', background: '#0a1d30', padding: '3px', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '8px' }}>
            {['Pending Review', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                style={{
                  flexGrow: 1, padding: '6px 4px', fontSize: '9px', fontWeight: '800',
                  borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: activeStatusTab === tab ? '#ff4f5a' : 'transparent',
                  color: activeStatusTab === tab ? 'white' : '#94a3b8',
                  textTransform: 'uppercase', transition: 'all 0.2s'
                }}
              >
                {tab === 'Pending Review' ? 'Pending' : tab}
              </button>
            ))}
          </div>

          {pendingListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748b', fontSize: '12px' }}>
              🎉 All registration pipelines are cleared! No pending properties to review.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingListings.map((listing) => {
                const isActive = selectedListing?.id === listing.id;
                return (
                  <div 
                    key={listing.id}
                    onClick={() => setSelectedListing(listing)}
                    style={{
                      border: '1px solid' + (isActive ? ' #ff4f5a' : ' #1e293b'),
                      background: isActive ? 'rgba(255, 79, 90, 0.05)' : '#0a1d30',
                      padding: '14px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#ff4f5a', textTransform: 'uppercase' }}>
                      {listing.propertyType} • {listing.subType}
                    </span>
                    <h5 style={{ fontWeight: '800', fontSize: '13px', color: '#f8fafc', marginTop: '4px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {listing.name}
                    </h5>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                      <MapPin size={12} />
                      {listing.city}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right Column: Detailed Property Inspector Sheet */}
        <main style={{ padding: '40px', overflowY: 'auto', textAlign: 'left' }}>
          {selectedListing ? (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              
              {/* Top Banner Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                  <span style={{ 
                    background: selectedListing.status === 'approved' ? '#10b981' : selectedListing.status === 'rejected' ? '#ef4444' : '#f59e0b', 
                    color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' 
                  }}>
                    {selectedListing.status === 'approved' ? 'Approved & Listed Live' : selectedListing.status === 'rejected' ? 'Rejected' : 'Pending Compliance Check'}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', marginTop: '8px', color: '#f8fafc' }}>{selectedListing.name}</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Registered Property ID: <strong>{selectedListing.id}</strong> • Star Rating: {selectedListing.stars} Star • Constructed: {selectedListing.yearBuilt}
                  </p>
                </div>

                {/* Approve/Reject Controls */}
                {selectedListing.status === 'Pending Review' ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={handleReject}
                      style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <X size={14} /> Reject
                    </button>
                    
                    <button 
                      onClick={() => handleAction(selectedListing.id, 'approved')}
                      style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={14} /> Approve & List Live
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: '800', color: selectedListing.status === 'approved' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', border: '1px solid', borderRadius: '6px', background: selectedListing.status === 'approved' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                    {selectedListing.status === 'approved' ? '✅ APPROVED' : '❌ REJECTED'}
                  </div>
                )}
              </div>

              {/* REJECTION REASON CARD */}
              {selectedListing.status === 'rejected' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                  <h5 style={{ color: '#ef4444', fontWeight: '800', fontSize: '13px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚠️ Rejection Reason (Reported to Partner)
                  </h5>
                  <p style={{ color: '#fca5a5', fontSize: '12px', margin: 0, fontWeight: '600' }}>
                    "{selectedListing.rejectionReason || 'No reason provided.'}"
                  </p>
                </div>
              )}

              {/* Inspector Content Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Left Inspector: Rooms, Amenities, Policies */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Photo & Video Cover */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                      <img 
                        src={selectedListing.image || selectedListing.coverPhoto || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"} 
                        alt="Cover image" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}>
                        Cover Photo
                      </div>
                    </div>
                    {/* Additional Photos Grid */}
                    {selectedListing.uploadedPhotos && selectedListing.uploadedPhotos.length > 0 && (
                      <div style={{ padding: '12px', borderTop: '1px solid #1e293b' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                          Uploaded Property Photos ({selectedListing.uploadedPhotos.length})
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedListing.uploadedPhotos.map((photo, pIdx) => (
                            <div 
                              key={pIdx} 
                              onClick={() => {
                                handlePreviewDocument({ name: `Photo ${pIdx + 1}`, data: photo });
                              }}
                              style={{ width: '52px', height: '52px', borderRadius: '6px', border: '1px solid #1e293b', overflow: 'hidden', cursor: 'pointer', boxSizing: 'border-box' }}
                            >
                              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rooms Configuration */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#ff4f5a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={16} /> Configured Rooms ({selectedListing.rooms?.length || 0})
                    </h4>
                    
                    {selectedListing.rooms && selectedListing.rooms.map((room, idx) => (
                      <div key={idx} style={{ background: '#071625', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h5 style={{ fontWeight: '800', fontSize: '13px', color: '#f8fafc' }}>{room.name || room.type}</h5>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>View: {room.view || 'No View'} • Size: {room.size}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>
                            ₹{Number(room.price || room.baseRate).toLocaleString('en-IN')}
                          </span>
                          <span style={{ display: 'block', fontSize: '9px', color: '#64748b' }}>{room.mealPlan || 'Room Only'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Amenities List */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#ff4f5a', marginBottom: '12px' }}>Selected Amenities</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedListing.amenities && selectedListing.amenities.map(am => (
                        <span key={am} style={{ background: '#071625', border: '1px solid #1e293b', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '10px' }}>
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Inspector: Legal Checks, Partner Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Contact & Partner Details */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#ff4f5a', marginBottom: '12px' }}>Onboarding Contacts</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Partner Name:</span>
                        <strong>{selectedListing.contactInfo?.email?.split('@')[0].toUpperCase() || 'RISHABH JAISWAL'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Email Address:</span>
                        <strong>{selectedListing.contactInfo?.email}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Mobile Number:</span>
                        <strong>{selectedListing.contactInfo?.mobile}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Financial Checks */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#ff4f5a', marginBottom: '12px' }}>Finance Verification</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>PAN Card Number:</span>
                        <strong>{selectedListing.finance?.panNumber}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>GST Number:</span>
                        <strong>{selectedListing.finance?.gstNumber || 'NA (MSME exempted)'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Bank Account Number:</span>
                        <strong>{selectedListing.finance?.accountNumber}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Bank Name:</span>
                        <strong>{selectedListing.finance?.bankName}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Attached Documents Checklist */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#ff4f5a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={16} /> Attached Documents for Approval
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ background: '#071625', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Leased Premises Document:</span>
                        {selectedListing.finance?.leasedDoc ? (
                          <strong style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            📄 {selectedListing.finance.leasedDoc.name || 'Leased_Document.pdf'}
                            <Eye 
                              size={14} 
                              style={{ cursor: 'pointer', color: '#ff4f5a' }} 
                              onClick={() => handlePreviewDocument(selectedListing.finance.leasedDoc)}
                            />
                          </strong>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>No document uploaded</span>
                        )}
                      </div>

                      <div style={{ background: '#071625', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Address / Relationship Proof:</span>
                        {selectedListing.finance?.relationshipDoc ? (
                          <strong style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            📄 {selectedListing.finance.relationshipDoc.name || 'Relationship_Proof.pdf'}
                            <Eye 
                              size={14} 
                              style={{ cursor: 'pointer', color: '#ff4f5a' }} 
                              onClick={() => handlePreviewDocument(selectedListing.finance.relationshipDoc)}
                            />
                          </strong>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>No document uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div style={{ height: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <Building size={48} style={{ marginBottom: '16px' }} />
              <h4>No Property Selected</h4>
              <p style={{ fontSize: '12px' }}>Select an item from the review queue on the left side to inspect it.</p>
            </div>
          )}
        </main>

      </div>

      {/* ================= FLOATING SUPPORT CHAT BUTTON ================= */}
      <button
        onClick={() => setIsAdminChatOpen(!isAdminChatOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
          borderRadius: '50%', background: '#ff4f5a', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
          boxShadow: '0 8px 24px rgba(255, 79, 90, 0.4)', zIndex: 190000, transition: 'transform 0.2s'
        }}
        title="Partner Support Chats"
      >
        <MessageSquare size={24} />
      </button>

      {/* ================= ADMIN CHAT WORKSPACE BOX ================= */}
      {isAdminChatOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', width: '360px', height: '480px',
          background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)', zIndex: 195000,
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Box Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', background: '#071625', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} style={{ color: '#ff4f5a' }} />
              <div>
                <h5 style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>Partner Support Center</h5>
                <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                  {selectedPartnerId ? `Chatting with ${selectedPartnerName}` : 'Select a Partner'}
                </span>
              </div>
            </div>
            {selectedPartnerId && (
              <button 
                onClick={() => { setSelectedPartnerId(null); setSelectedPartnerName(''); }}
                style={{ background: '#0a1d30', border: '1px solid #1e293b', color: '#cbd5e1', fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >
                ← Back
              </button>
            )}
          </div>

          {/* Box Body */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!selectedPartnerId ? (
              // Chat Threads List View
              chatGroupList.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '11px', marginTop: '100px' }}>
                  No active support requests from partners yet.
                </div>
              ) : (
                chatGroupList.map((group) => (
                  <div 
                    key={group.partnerId}
                    onClick={() => {
                      setSelectedPartnerId(group.partnerId);
                      setSelectedPartnerName(group.partnerName);
                    }}
                    style={{
                      background: '#071625', border: '1px solid #1e293b', padding: '12px',
                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '11px', color: '#ff4f5a' }}>👤 {group.partnerName}</span>
                      <span style={{ fontSize: '8px', color: '#64748b' }}>
                        {new Date(group.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '10px', color: '#cbd5e1', margin: '4px 0 0 0', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {group.lastMessage}
                    </p>
                  </div>
                ))
              )
            ) : (
              // Chat Conversation View
              (() => {
                const threadMsgs = chatGroups[selectedPartnerId]?.messages || [];
                return threadMsgs.map((msg, index) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div 
                      key={index} 
                      style={{
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: isAdmin ? '#ff4f5a' : '#071625',
                        border: isAdmin ? 'none' : '1px solid #1e293b',
                        color: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        borderBottomRightRadius: isAdmin ? '2px' : '12px',
                        borderBottomLeftRadius: isAdmin ? '12px' : '2px',
                        fontSize: '11px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        lineHeight: 1.4
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
                              style={{ maxWidth: '100%', maxHeight: '110px', objectFit: 'contain', borderRadius: '6px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
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
                                background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)',
                                padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>📄</span>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#ff4f5a', display: 'block' }}>{msg.fileName}</span>
                                <span style={{ fontSize: '7.5px', color: '#cbd5e1' }}>Click to view document</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()
            )}
          </div>

          {/* Box Input Footer (Only in active chat mode) */}
          {selectedPartnerId && (
            <div style={{ padding: '12px', borderTop: '1px solid #1e293b', background: '#071625', display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Attachment trigger */}
              <button 
                type="button"
                onClick={() => document.getElementById('admin-chat-file-input').click()}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', color: '#cbd5e1' }}
                title="Attach Document / Photo / Video"
              >
                <Paperclip size={18} />
              </button>
              <input 
                id="admin-chat-file-input"
                type="file"
                accept="image/*,video/*,application/pdf"
                style={{ display: 'none' }}
                onChange={handleSendAdminFile}
              />
              
              <input 
                type="text"
                placeholder="Type reply..."
                value={adminChatText}
                onChange={(e) => setAdminChatText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendAdminReply(); }}
                style={{
                  flexGrow: 1, padding: '8px 12px', border: '1px solid #1e293b', borderRadius: '8px',
                  background: '#0a1d30', color: '#f8fafc', fontSize: '11px', boxSizing: 'border-box', outline: 'none'
                }}
              />
              <button 
                onClick={handleSendAdminReply}
                style={{
                  background: '#ff4f5a', border: 'none', color: '#ffffff', fontWeight: '700',
                  padding: '8px 14px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      {previewDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(5, 20, 41, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200000,
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
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Document Viewer</h4>
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
                  src={previewDoc.data || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"} 
                  alt="Document Preview" 
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
