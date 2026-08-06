import React from 'react';
import { BadgeCheck, Calendar, MapPin, Ticket, ShieldCheck } from 'lucide-react';

export default function BookingDetails({ bookings, onBackToSearch }) {
  return (
    <div className="bookings-panel-container container animate-fade-in-up">
      <div className="section-header">
        <h2>Your Booking Dashboard</h2>
        <button className="btn-outline" onClick={onBackToSearch}>Back to Search</button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings-box">
          <Ticket size={48} style={{ margin: '0 auto 16px auto', color: 'var(--text-light)', opacity: 0.6 }} />
          <h3>No bookings found</h3>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>You haven't made any bookings yet. Search and complete checkouts to see your e-vouchers here!</p>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={onBackToSearch}>Book Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="item-card" style={{ borderLeft: '5px solid #10b981' }}>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-primary">{booking.type}</span>
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} />
                        {booking.status}
                      </span>
                    </div>
                    
                    <h3 style={{ marginTop: '10px', fontSize: '18px', fontWeight: '800' }}>
                      {booking.type === 'flights' && `${booking.item.from} ➔ ${booking.item.to}`}
                      {booking.type === 'hotels' && booking.item.name}
                      {booking.type === 'trains' && `${booking.item.name} (${booking.item.trainNo})`}
                      {booking.type === 'buses' && `${booking.item.from} ➔ ${booking.item.to}`}
                      {booking.type === 'packages' && booking.item.title}
                    </h3>
                  </div>

                  <div style={{ textAlignment: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>PNR / VOUCHER</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '0.5px' }}>
                      {booking.pnr}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', fontSize: '13px', color: 'var(--text-medium)' }}>
                  {/* Itinerary info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      <Calendar size={14} />
                      Journey Date
                    </div>
                    <div style={{ marginTop: '4px' }}>{booking.date}</div>
                  </div>

                  {/* Seat / Room info */}
                  <div>
                    {booking.type === 'hotels' ? (
                      <>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Room Type</div>
                        <div style={{ marginTop: '4px' }}>{booking.room?.type || 'Standard Room'}</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Seat Selection</div>
                        <div style={{ marginTop: '4px' }}>{booking.seats.length > 0 ? booking.seats.join(', ') : 'Auto-Assigned'}</div>
                      </>
                    )}
                  </div>

                  {/* Passengers info */}
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Passengers / Guests</div>
                    <div style={{ marginTop: '4px' }}>
                      {booking.passengers.map((p, i) => `${p.title} ${p.firstName} ${p.lastName}`).join(', ')}
                    </div>
                  </div>

                  {/* Total Paid */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Total Paid</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '800', color: 'var(--text-dark)', marginTop: '4px' }}>
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
