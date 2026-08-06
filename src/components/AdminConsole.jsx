import React, { useState, useEffect } from 'react';
import { dbGetPendingListings, dbUpdateListingStatus } from '../data/dbService';
import { ShieldCheck, LogOut, Check, X, Building, MapPin, Eye, FileText, ArrowRight } from 'lucide-react';

export default function AdminConsole({ activeUser, onLogout }) {
  const [pendingListings, setPendingListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  const loadPending = async () => {
    try {
      const list = await dbGetPendingListings();
      setPendingListings(list);
      if (list.length > 0 && !selectedListing) {
        setSelectedListing(list[0]);
      } else if (list.length === 0) {
        setSelectedListing(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleAction = async (propertyId, status) => {
    try {
      await dbUpdateListingStatus(propertyId, 'Hotel', status);
      alert(`Property has been ${status === 'approved' ? 'Approved & Listed live! ✅' : 'Rejected. ❌'}`);
      
      // Reload lists
      const list = await dbGetPendingListings();
      setPendingListings(list);
      // Reset selected or take first
      if (list.length > 0) {
        setSelectedListing(list[0]);
      } else {
        setSelectedListing(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

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
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '8px', textAlign: 'left' }}>
            Review Queue ({pendingListings.length})
          </h4>

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
                  <span style={{ background: '#f59e0b', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    PENDING COMPLIANCE CHECK
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', marginTop: '8px', color: '#f8fafc' }}>{selectedListing.name}</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Registered Property ID: <strong>{selectedListing.id}</strong> • Star Rating: {selectedListing.stars} Star • Constructed: {selectedListing.yearBuilt}
                  </p>
                </div>

                {/* Approve/Reject Controls */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleAction(selectedListing.id, 'rejected')}
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
              </div>

              {/* Inspector Content Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Left Inspector: Rooms, Amenities, Policies */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Photo & Video Cover */}
                  <div style={{ background: '#0a1d30', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                      <img src={selectedListing.image} alt="Cover image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}>
                        Cover Photo
                      </div>
                    </div>
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
                        <strong style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          📄 Leave_License_Agreement_Signed.pdf <Eye size={12} style={{ cursor: 'pointer', color: '#ff4f5a' }} />
                        </strong>
                      </div>

                      <div style={{ background: '#071625', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Address / Relationship Proof:</span>
                        <strong style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          📄 Relationship_Proof_Electricity_Bill.pdf <Eye size={12} style={{ cursor: 'pointer', color: '#ff4f5a' }} />
                        </strong>
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
    </div>
  );
}
