import React, { useState } from 'react';
import { X, Star, MapPin, Check, Image as ImageIcon, Map, MessageSquare } from 'lucide-react';

export default function HotelDetails({ isOpen, onClose, hotel, onSelectRoom }) {
  if (!isOpen || !hotel) return null;

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms', 'photos', 'reviews'
  const [activePhoto, setActivePhoto] = useState(hotel.image);

  // Seeded reviews list
  const reviews = [
    { name: "Rahul S.", rating: 5, date: "July 2026", text: "Amazing hospitality! The beach is just steps away and the spa treatment was outstanding." },
    { name: "Priya M.", rating: 4, date: "June 2026", text: "Lovely rooms and great pool area. The breakfast spread was huge with many local options." },
    { name: "Amit K.", rating: 5, date: "May 2026", text: "Taj standard at its finest. Royal treatment from checkout to departure. Highly recommended." }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-in" style={{ maxWidth: '1000px', height: '85vh' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
              ))}
            </div>
            <h3 style={{ marginTop: '4px' }}>{hotel.name}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={10} />
              {hotel.address}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Details Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-input)', padding: '0 30px' }}>
          {[
            { id: 'rooms', label: 'Rooms & Options', icon: <Check size={14} /> },
            { id: 'photos', label: 'Photos & Gallery', icon: <ImageIcon size={14} /> },
            { id: 'reviews', label: 'User Reviews', icon: <MessageSquare size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 20px',
                fontSize: '13px',
                fontWeight: '700',
                color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-medium)',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ overflowY: 'auto', padding: '30px', flexGrow: 1 }}>
          
          {activeTab === 'rooms' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px' }}>
              
              {/* Left Side: Overview & Room Table */}
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '10px' }}>Hotel Overview</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {hotel.description}
                </p>

                <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '14px' }}>Available Room Types</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {hotel.rooms && hotel.rooms.map((room) => (
                    <div 
                      key={room.type}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <div style={{ maxWidth: '65%' }}>
                        <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Premium Rate</span>
                        <h5 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-dark)' }}>{room.type}</h5>
                        <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px', lineHeight: 1.4 }}>{room.description}</p>
                        
                        {/* Mock inclusions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
                          <span>✓ Free Breakfast</span>
                          <span>✓ Free Cancellation</span>
                          <span>✓ Gym Access</span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ textDecoration: 'line-through', fontSize: '11px', color: 'var(--text-light)' }}>
                          ₹{Math.round(room.price * 1.25).toLocaleString('en-IN')}
                        </span>
                        <div style={{ fontWeight: '800', fontSize: '20px', color: 'var(--text-dark)', marginTop: '2px' }}>₹{room.price.toLocaleString('en-IN')}</div>
                        <span style={{ fontSize: '10px', color: 'var(--text-light)', display: 'block', marginBottom: '8px' }}>Per Night + taxes</span>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '16px' }}
                          onClick={() => onSelectRoom(room)}
                        >
                          Select & Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Map & Inclusions sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Mock Map Embed Grid */}
                <div style={{ border: '1px solid var(--border-light)', borderRadius: '10px', padding: '16px', background: 'var(--bg-input)' }}>
                  <h5 style={{ fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Map size={14} style={{ color: 'var(--primary-color)' }} />
                    Property Location
                  </h5>
                  
                  {/* Mock Map graphics box */}
                  <div style={{
                    height: '140px',
                    borderRadius: '6px',
                    background: '#cbd5e1',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #94a3b8',
                    position: 'relative'
                  }}>
                    {/* SVG map visual */}
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', opacity: 0.3, position: 'absolute' }}>
                      <line x1="10" y1="10" x2="90" y2="90" stroke="black" strokeWidth="2" />
                      <line x1="90" y1="10" x2="10" y2="90" stroke="black" strokeWidth="2" />
                      <circle cx="50" cy="50" r="10" fill="gray" />
                    </svg>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#ff4f5a',
                      position: 'absolute',
                      animation: 'pulseBorder 2s infinite',
                      boxShadow: '0 0 0 4px rgba(255, 79, 90, 0.4)'
                    }} />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b', background: 'white', padding: '4px 8px', borderRadius: '4px', zIndex: 5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                      GPS: 15.2993° N
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', marginTop: '8px', textAlign: 'center' }}>
                    Located near key local sightseeing hotspots & transit nodes.
                  </span>
                </div>

                {/* Popular Amenities Roster */}
                <div style={{ border: '1px solid var(--border-light)', borderRadius: '10px', padding: '20px', background: '#ffffff' }}>
                  <h5 style={{ fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>Popular Amenities</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {hotel.amenities.map((am, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-medium)' }}>
                        <span style={{ color: 'var(--primary-color)' }}>✓</span>
                        {am}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'photos' && (
            <div>
              <div style={{ height: '350px', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border-light)' }}>
                <img src={activePhoto} alt="Gallery Big" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                {[
                  hotel.image,
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80"
                ].map((ph, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActivePhoto(ph)}
                    style={{
                      width: '100px',
                      height: '70px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activePhoto === ph ? '3px solid var(--primary-color)' : '1px solid var(--border-light)',
                      flexShrink: 0
                    }}
                  >
                    <img src={ph} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-input)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ background: 'var(--primary-color)', color: 'white', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800' }}>
                  {hotel.rating}
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '16px' }}>Overall Rating</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>Based on {hotel.reviewsCount} verified guest reviews.</div>
                </div>
              </div>

              {reviews.map((rev, index) => (
                <div key={index} style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{rev.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{rev.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '3px', color: '#fbbf24', fontSize: '10px', marginBottom: '8px' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={10} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: 1.5 }}>
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
