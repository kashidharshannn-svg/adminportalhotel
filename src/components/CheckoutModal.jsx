import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, CreditCard, ShieldAlert, BadgeCheck, Check, Sparkles } from 'lucide-react';
import SeatMap from './SeatMap';

export default function CheckoutModal({ isOpen, onClose, selectedItem, searchParams, tab, onBookingSuccess }) {
  if (!isOpen || !selectedItem) return null;

  const [step, setStep] = useState(1); // 1: Passengers/Details, 2: Seats/Upgrades, 3: Payment Gateway
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Form Fields
  const [passengers, setPassengers] = useState([
    { title: 'Mr', firstName: '', lastName: '', gender: 'Male', age: '' }
  ]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Seat & Room States
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(
    selectedItem.rooms ? selectedItem.rooms[0] : null
  );

  // Addons
  const [insurance, setInsurance] = useState(false);
  const [meal, setMeal] = useState(false);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Razorpay Payment Tabs
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'wallet'
  
  // Payment Form Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  // Sync passengers count from searchParams
  useEffect(() => {
    let count = 1;
    if (tab === 'flights') {
      count = (searchParams.adults || 1) + (searchParams.children || 0);
    } else if (tab === 'hotels') {
      count = searchParams.guests || 2;
    }
    
    const initialPassengers = Array.from({ length: count }).map(() => ({
      title: 'Mr',
      firstName: '',
      lastName: '',
      gender: 'Male',
      age: ''
    }));
    setPassengers(initialPassengers);
  }, [selectedItem, searchParams, tab]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // Base pricing calculations
  const getBasePrice = () => {
    if (tab === 'flights') {
      return selectedItem.price * passengers.length;
    } else if (tab === 'hotels') {
      const nights = 4;
      const baseRoomPrice = selectedRoom ? selectedRoom.price : selectedItem.price;
      return baseRoomPrice * (searchParams.rooms || 1) * nights;
    } else if (tab === 'trains') {
      const classPrice = selectedItem.selectedClassPrice || selectedItem.classes[0].price;
      return classPrice * passengers.length;
    } else if (tab === 'buses') {
      return selectedItem.price * passengers.length;
    } else if (tab === 'packages') {
      return selectedItem.price * passengers.length;
    }
    return 0;
  };

  const getTaxes = () => Math.round(getBasePrice() * 0.18); // 18% GST
  const getConvenienceFee = () => 350; // MMT style flat fee
  const getAddonsPrice = () => {
    let total = 0;
    if (insurance) total += 299 * passengers.length;
    if (meal) total += 399 * passengers.length;
    return total;
  };

  const getSubtotal = () => getBasePrice() + getTaxes() + getConvenienceFee() + getAddonsPrice();
  const getTotalAmount = () => Math.max(0, getSubtotal() - promoDiscount);

  // Apply Promo Codes (20% off)
  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (['MMTFLIGHT', 'MMTHOTEL', 'MMTISLAND', 'MMTTRAIN', 'MMTBUS'].includes(code)) {
      const discount = Math.round(getBasePrice() * 0.20);
      setPromoDiscount(discount);
      setAppliedPromo(code);
      setPromoInput('');
    } else {
      alert("Invalid Promo Code! Try MMTFLIGHT or MMTHOTEL.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setPromoDiscount(0);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const incomplete = passengers.some(p => !p.firstName || !p.lastName || !p.age);
    if (incomplete || !email || !phone) {
      alert("Please fill all passenger names, age, phone number, and email.");
      return;
    }
    
    if (tab === 'flights' || tab === 'buses') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSeatsConfirmed = (seats) => {
    setSelectedSeats(seats);
    setStep(3);
  };

  // Secure Razorpay API simulation
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) {
      alert("Please fill all Credit/Debit Card fields.");
      return;
    }
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      alert("Please enter a valid UPI ID (e.g., name@okaxis).");
      return;
    }

    setLoading(true);
    setLoadingMessage("Razorpay Secure: Initiating merchant validation and price lock checks...");
    
    setTimeout(() => {
      setLoadingMessage("Razorpay: Fetching bank OTP gateways and verifying card authentication...");
      setTimeout(() => {
        setLoadingMessage("GDS Order: Registering passenger manifests and creating PNR...");
        setTimeout(() => {
          setLoading(false);
          const mockPnr = "MMT" + Math.random().toString(36).substring(2, 8).toUpperCase();
          const booking = {
            id: "BK-" + Date.now(),
            pnr: mockPnr,
            type: tab,
            item: selectedItem,
            passengers,
            seats: selectedSeats,
            room: selectedRoom,
            totalAmount: getTotalAmount(),
            date: searchParams.departureDate || '2026-08-10',
            status: 'Confirmed'
          };
          onBookingSuccess(booking);
          setStep(4);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-in" style={{ height: '90vh' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--secondary-color)' }} />
              Checkout Wizard
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
              Step {step === 4 ? 'Complete' : `${step} of 3`}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Razorpay secured loader */}
        {loading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(10, 34, 64, 0.95)', zIndex: 200,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '40px', textAlign: 'center'
          }}>
            <div className="spin-loader" style={{
              width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#008cff', borderRadius: '50%', marginBottom: '20px'
            }} />
            <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px', color: '#00b4d8' }}>Razorpay Secure Payment System</h4>
            <p style={{ maxWidth: '500px', fontSize: '14px', opacity: 0.8, color: '#a3b8cc' }}>{loadingMessage}</p>
          </div>
        )}

        {/* Modal Scroll Container */}
        {step < 4 && (
          <div className="modal-body-scroll">
            
            {/* Left side: checkout inputs */}
            <div className="checkout-form-side">
              
              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="checkout-form-side">
                  
                  {/* Passenger input block */}
                  <div className="checkout-section-box">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} />
                      Passenger Details
                    </h4>
                    
                    {passengers.map((passenger, index) => (
                      <div key={index} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: index < passengers.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                        <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-medium)', marginBottom: '10px' }}>
                          Passenger #{index + 1}
                        </div>
                        <div className="passenger-input-grid">
                          <div className="input-group">
                            <label>Title</label>
                            <select 
                              value={passenger.title}
                              onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                            >
                              <option>Mr</option>
                              <option>Ms</option>
                              <option>Mrs</option>
                            </select>
                          </div>
                          <div className="input-group">
                            <label>First Name</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. John"
                              value={passenger.firstName}
                              onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>Last Name</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. Doe"
                              value={passenger.lastName}
                              onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                            />
                          </div>
                          <div className="input-group">
                            <label>Age</label>
                            <input 
                              type="number" 
                              required 
                              min="1"
                              placeholder="Age"
                              value={passenger.age}
                              onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact inputs block */}
                  <div className="checkout-section-box">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} />
                      Contact details (For Ticket Delivery)
                    </h4>
                    <div className="passenger-input-grid">
                      <div className="input-group">
                        <label>Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="10-digit Mobile"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special requests block */}
                  <div className="checkout-section-box">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldAlert size={16} />
                      Special requests (Optional)
                    </h4>
                    <div className="input-group">
                      <textarea 
                        placeholder="e.g. High floor room, silent zone, extra wheelchair access..."
                        rows="2"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        style={{
                          width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-light)', 
                          borderRadius: '6px', padding: '10px', fontSize: '13px', resize: 'none', outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    Proceed to Options
                  </button>

                </form>
              )}

              {step === 2 && (
                <div>
                  <div className="checkout-section-box">
                    <SeatMap 
                      type={tab} 
                      maxSeats={passengers.length} 
                      onConfirm={handleSeatsConfirmed} 
                    />
                  </div>
                  <button 
                    className="btn-outline" 
                    style={{ marginTop: '16px', width: '100%' }}
                    onClick={() => setStep(1)}
                  >
                    Back to Passengers
                  </button>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handlePaymentSubmit} className="checkout-form-side animate-scale-in">
                  
                  {/* Razorpay layout replacement */}
                  <div className="checkout-section-box" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ background: '#09264c', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#00b4d8', fontWeight: '700', textTransform: 'uppercase' }}>RAZORPAY SECURED MERCHANT</div>
                        <div style={{ fontWeight: '800', fontSize: '15px' }}>Trip Customizer India Ltd</div>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '800' }}>₹{getTotalAmount().toLocaleString('en-IN')}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', minHeight: '260px' }}>
                      
                      {/* Left: Payment Tabs */}
                      <div style={{ borderRight: '1px solid var(--border-light)', background: 'var(--bg-input)', display: 'flex', flexDirection: 'column' }}>
                        {[
                          { id: 'card', label: 'Cards' },
                          { id: 'upi', label: 'UPI / QR' },
                          { id: 'netbanking', label: 'Net Banking' }
                        ].map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setPaymentMethod(t.id)}
                            style={{
                              padding: '16px 12px', fontSize: '12px', fontWeight: '700', textAlignment: 'left',
                              color: paymentMethod === t.id ? 'var(--primary-color)' : 'var(--text-medium)',
                              background: paymentMethod === t.id ? '#ffffff' : 'transparent',
                              borderBottom: '1px solid var(--border-light)', transition: 'all 0.2s'
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Right: Payment Fields */}
                      <div style={{ padding: '24px' }}>
                        {paymentMethod === 'card' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label>Cardholder Name</label>
                              <input 
                                type="text" 
                                required 
                                placeholder="Name on card"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                              />
                            </div>
                            <div className="input-group">
                              <label>Card Number</label>
                              <input 
                                type="text" 
                                required 
                                maxLength="16"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                              <div className="input-group">
                                <label>Expiry</label>
                                <input 
                                  type="text" 
                                  required 
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                />
                              </div>
                              <div className="input-group">
                                <label>CVV</label>
                                <input 
                                  type="password" 
                                  required 
                                  maxLength="3"
                                  placeholder="***"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'upi' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label>Enter UPI ID</label>
                              <input 
                                type="text" 
                                required 
                                placeholder="username@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                              <span style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>
                                Pay securely via GooglePay, PhonePe, or BHIM apps.
                              </span>
                            </div>
                            
                            <div style={{ border: '1px dashed var(--border-light)', borderRadius: '6px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-input)' }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px' }}>🔲</div>
                                <span style={{ fontSize: '11px', fontWeight: '600' }}>Scan QR Code dynamically on mobile</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'netbanking' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map(bank => (
                              <button
                                key={bank}
                                type="button"
                                style={{
                                  padding: '12px', border: '1px solid var(--border-light)', borderRadius: '6px',
                                  fontSize: '12px', fontWeight: '600', hover: { borderColor: 'var(--primary-color)' }
                                }}
                                onClick={() => alert(`Redirecting to ${bank} Netbanking portal...`)}
                              >
                                {bank}
                              </button>
                            ))}
                          </div>
                        )}

                      </div>

                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      type="button" 
                      className="btn-outline" 
                      onClick={() => setStep(tab === 'flights' || tab === 'buses' ? 2 : 1)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flexGrow: 1, justifyContent: 'center' }}>
                      Complete Secure Payment
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* Right side: Billing summary card */}
            <div className="billing-summary-side">
              <h4 className="summary-heading">Booking Summary</h4>
              
              <div style={{ marginBottom: '20px' }}>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>{tab}</span>
                <h5 style={{ fontWeight: '800', fontSize: '15px', marginTop: '6px', color: 'var(--text-dark)' }}>
                  {tab === 'flights' && `${selectedItem.from} ➔ ${selectedItem.to}`}
                  {tab === 'hotels' && selectedItem.name}
                  {tab === 'trains' && `${selectedItem.name}`}
                  {tab === 'buses' && `${selectedItem.from} ➔ ${selectedItem.to}`}
                  {tab === 'packages' && selectedItem.title}
                </h5>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', marginTop: '2px' }}>
                  {tab === 'flights' && `${selectedItem.airline} • ${selectedItem.flightNo}`}
                  {tab === 'hotels' && `${searchParams.rooms || 1} Room(s) • 4 Nights`}
                  {tab === 'buses' && `${selectedItem.operator}`}
                  {tab === 'packages' && `${selectedItem.duration}`}
                </span>
              </div>

              {/* Price Details */}
              <div className="summary-row">
                <span>Base Price ({passengers.length} pax)</span>
                <span>₹{getBasePrice().toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row">
                <span>GST & Service Tax (18%)</span>
                <span>₹{getTaxes().toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row">
                <span>Convenience Fee</span>
                <span>₹{getConvenienceFee().toLocaleString('en-IN')}</span>
              </div>

              {insurance && (
                <div className="summary-row">
                  <span>Travel Insurance</span>
                  <span>₹{(299 * passengers.length).toLocaleString('en-IN')}</span>
                </div>
              )}
              {meal && (
                <div className="summary-row">
                  <span>Inflight Meals</span>
                  <span>₹{(399 * passengers.length).toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Promo code application block */}
              <div style={{ borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '14px 0', margin: '14px 0' }}>
                {appliedPromo ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.1)', padding: '8px 12px', borderRadius: '4px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981' }}>CODE APPLIED: {appliedPromo}</span>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>Saved ₹{promoDiscount.toLocaleString('en-IN')}!</div>
                    </div>
                    <button type="button" onClick={handleRemovePromo} style={{ color: 'var(--secondary-color)', fontSize: '11px', fontWeight: '700' }}>Remove</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="ENTER PROMO CODE"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      style={{
                        flexGrow: 1, background: '#ffffff', border: '1px solid var(--border-light)', 
                        borderRadius: '4px', padding: '6px 10px', fontSize: '11px', textTransform: 'uppercase', outline: 'none'
                      }}
                    />
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>₹{getTotalAmount().toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>
        )}

        {/* Success */}
        {step === 4 && (
          <div style={{ padding: '60px 40px', textAlign: 'center', overflowY: 'auto' }}>
            <div className="success-icon-badge">
              <BadgeCheck size={44} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '24px', color: '#10b981' }}>Booking Successfully Completed!</h2>
            <p style={{ color: 'var(--text-medium)', fontSize: '14px', marginTop: '6px' }}>
              Your order was confirmed via Razorpay checkout. Check your booking history to download voucher.
            </p>
            
            <div className="ticket-pnr-badge">
              PNR / VOUCHER ID: {selectedItem.pnr || "MOCK-PNR"}
            </div>

            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={onClose}>
              Close & View Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
