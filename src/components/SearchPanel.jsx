import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Users, ChevronDown, Sparkles, ArrowRightLeft } from 'lucide-react';

const FLIGHT_STATIONS = [
  { city: "Delhi", airport: "Indira Gandhi Intl", code: "DEL", desc: "Delhi (DEL)" },
  { city: "Mumbai", airport: "Chhatrapati Shivaji", code: "BOM", desc: "Mumbai (BOM)" },
  { city: "Goa", airport: "Dabolim Airport", code: "GOI", desc: "Goa (GOI)" },
  { city: "Bangalore", airport: "Kempegowda Intl", code: "BLR", desc: "Bangalore (BLR)" },
  { city: "Dubai", airport: "Dubai International", code: "DXB", desc: "Dubai (DXB)" },
  { city: "London", airport: "Heathrow Airport", code: "LHR", desc: "London (LHR)" },
  { city: "Paris", airport: "Charles de Gaulle", code: "CDG", desc: "Paris (CDG)" },
  { city: "Singapore", airport: "Changi Airport", code: "SIN", desc: "Singapore (SIN)" }
];

const HOTEL_CITIES = [
  { city: "Goa", desc: "Goa, India" },
  { city: "Delhi", desc: "Delhi NCR, India" },
  { city: "Mumbai", desc: "Mumbai, Maharashtra, India" },
  { city: "Dubai", desc: "Dubai, United Arab Emirates" },
  { city: "Srinagar", desc: "Srinagar, Jammu & Kashmir, India" }
];

const TRAIN_STATIONS = [
  { city: "Delhi (NDLS)", airport: "New Delhi Railway Station", code: "NDLS", desc: "Delhi (NDLS)" },
  { city: "Varanasi (BSB)", airport: "Varanasi Junction", code: "BSB", desc: "Varanasi (BSB)" },
  { city: "Mumbai (BCT)", airport: "Mumbai Central Station", code: "BCT", desc: "Mumbai (BCT)" }
];

const BUS_CITIES = [
  { city: "Delhi", desc: "Delhi NCR" },
  { city: "Manali", desc: "Manali, Himachal Pradesh" },
  { city: "Bangalore", desc: "Bangalore, Karnataka" },
  { city: "Goa", desc: "Goa, Beaches" },
  { city: "Mumbai", desc: "Mumbai, Maharashtra" },
  { city: "Pune", desc: "Pune, Maharashtra" }
];

const PACKAGE_DESTINATIONS = [
  { city: "Kashmir", desc: "Kashmir Paradise" },
  { city: "Goa", desc: "Goa Fun & Beach" },
  { city: "Maldives", desc: "Maldives Luxury Overwater" },
  { city: "Switzerland", desc: "Switzerland Scenic Train & Alps" }
];

export default function SearchPanel({ activeTab, onSearch }) {
  // Input fields states
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-08-10');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState('one-way'); // flights only
  const [specialFare, setSpecialFare] = useState('regular'); // flights only

  // Traveller states
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  
  // Hotel guest states
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  // UI Dropdown controls
  const [showFromSuggest, setShowFromSuggest] = useState(false);
  const [showToSuggest, setShowToSuggest] = useState(false);
  const [showTravellers, setShowTravellers] = useState(false);

  // Suggest list based on active tab
  const getFromSuggestions = () => {
    if (activeTab === 'flights') return FLIGHT_STATIONS;
    if (activeTab === 'trains') return TRAIN_STATIONS;
    return BUS_CITIES;
  };

  const getToSuggestions = () => {
    if (activeTab === 'flights') return FLIGHT_STATIONS;
    if (activeTab === 'hotels') return HOTEL_CITIES;
    if (activeTab === 'trains') return TRAIN_STATIONS;
    if (activeTab === 'packages') return PACKAGE_DESTINATIONS;
    return BUS_CITIES;
  };

  // Reset defaults on tab change
  useEffect(() => {
    if (activeTab === 'flights') {
      setFromLoc(FLIGHT_STATIONS[0]);
      setToLoc(FLIGHT_STATIONS[1]);
      setDepartureDate('2026-08-10');
      setReturnDate('');
    } else if (activeTab === 'hotels') {
      setToLoc(HOTEL_CITIES[0]);
      setDepartureDate('2026-08-10');
      setReturnDate('2026-08-14');
    } else if (activeTab === 'trains') {
      setFromLoc(TRAIN_STATIONS[0]);
      setToLoc(TRAIN_STATIONS[1]);
      setDepartureDate('2026-08-10');
    } else if (activeTab === 'buses') {
      setFromLoc(BUS_CITIES[0]);
      setToLoc(BUS_CITIES[1]);
      setDepartureDate('2026-08-10');
    } else if (activeTab === 'packages') {
      setFromLoc({ city: "Delhi", desc: "Delhi NCR" });
      setToLoc(PACKAGE_DESTINATIONS[0]);
      setDepartureDate('2026-08-10');
    } else if (activeTab === 'homestays') {
      setToLoc(HOTEL_CITIES[0]);
      setDepartureDate('2026-08-10');
      setReturnDate('2026-08-14');
    } else if (activeTab === 'cabs') {
      setFromLoc(BUS_CITIES[0]);
      setToLoc(BUS_CITIES[1]);
      setDepartureDate('2026-08-10');
    }
    // Close panels
    setShowFromSuggest(false);
    setShowToSuggest(false);
    setShowTravellers(false);
  }, [activeTab]);

  // Click outside handling
  const panelRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowFromSuggest(false);
        setShowToSuggest(false);
        setShowTravellers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = () => {
    // Treat cabs or homestays similar to transport or hotels for booking demo
    const effectiveTab = activeTab === 'homestays' ? 'hotels' : activeTab === 'cabs' ? 'buses' : activeTab;
    onSearch({
      tab: effectiveTab,
      from: fromLoc,
      to: toLoc,
      departureDate,
      returnDate,
      tripType,
      adults,
      children,
      travelClass,
      rooms,
      guests,
      specialFare
    });
  };

  const handleSwap = (e) => {
    e.stopPropagation();
    const temp = fromLoc;
    setFromLoc(toLoc);
    setToLoc(temp);
  };

  const formatDateText = (dateString) => {
    if (!dateString) return 'Select Date';
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear().toString().substring(2);
    return `${day} ${month} '${year}`;
  };

  const getWeekday = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-US', { weekday: 'long' });
  };

  return (
    <div className="search-panel-container animate-fade-in-up" ref={panelRef}>
      <div className="search-card" style={{ paddingBottom: '50px' }}>
        
        {/* Toggle options for Flights / Trip types */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="search-card-type-row" style={{ margin: 0 }}>
            {activeTab === 'flights' && (
              <>
                <label>
                  <input 
                    type="radio" 
                    name="tripType" 
                    checked={tripType === 'one-way'} 
                    onChange={() => { setTripType('one-way'); setReturnDate(''); }} 
                  />
                  One Way
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="tripType" 
                    checked={tripType === 'round-trip'} 
                    onChange={() => { setTripType('round-trip'); setReturnDate('2026-08-17'); }} 
                  />
                  Round Trip
                </label>
              </>
            )}

            {(activeTab === 'hotels' || activeTab === 'homestays') && (
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
                Book Premium Hotels, Resorts and Villas
              </span>
            )}
            
            {activeTab === 'packages' && (
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
                Customized Holidays & Tour Packages
              </span>
            )}

            {activeTab === 'trains' && (
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
                IRCTC Authorized Train Ticket Bookings
              </span>
            )}

            {activeTab === 'buses' && (
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
                Online Bus Ticket Booking with Live Tracking
              </span>
            )}

            {activeTab === 'cabs' && (
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-color)' }}>
                Outstation Cab Bookings & Airport Transfers
              </span>
            )}
          </div>
          
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
            Book Online with GDS Price Guarantee
          </div>
        </div>

        {/* Input Fields Grid */}
        <div style={{ position: 'relative' }}>
          
          {/* Exchange/Swap Icon for Flight, Train, Bus, Cabs */}
          {(activeTab === 'flights' || activeTab === 'trains' || activeTab === 'buses' || activeTab === 'cabs') && (
            <button 
              onClick={handleSwap}
              style={{
                position: 'absolute',
                left: '28.5%', /* Centered between From (30%) and To */
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)',
                zIndex: 10,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
            >
              <ArrowRightLeft size={16} />
            </button>
          )}

          <div className={`search-fields-grid ${(activeTab === 'hotels' || activeTab === 'homestays') ? 'hotels-grid' : (activeTab === 'buses' || activeTab === 'cabs') ? 'buses-grid' : ''}`}>
            
            {/* FROM FIELD (Skip for Hotels/Packages) */}
            {activeTab !== 'hotels' && activeTab !== 'homestays' && activeTab !== 'packages' && (
              <div className="search-field-box" onClick={() => { setShowFromSuggest(true); setShowToSuggest(false); setShowTravellers(false); }}>
                <span className="field-label">From</span>
                <span className="field-value" style={{ fontSize: '24px' }}>{fromLoc.city || 'Select'}</span>
                <span className="field-desc">{fromLoc.airport || fromLoc.desc || 'Origin'}</span>
                
                {showFromSuggest && (
                  <div className="suggest-dropdown" style={{ left: 0 }}>
                    {getFromSuggestions().map((station) => (
                      <div 
                        key={station.code || station.city} 
                        className="suggest-item"
                        onClick={(e) => { e.stopPropagation(); setFromLoc(station); setShowFromSuggest(false); }}
                      >
                        <div className="suggest-city-details">
                          <span className="suggest-city">{station.city}</span>
                          <span className="suggest-airport">{station.airport || station.desc}</span>
                        </div>
                        {station.code && <span className="suggest-code">{station.code}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TO FIELD */}
            <div className="search-field-box" onClick={() => { setShowToSuggest(true); setShowFromSuggest(false); setShowTravellers(false); }}>
              <span className="field-label">
                {activeTab === 'hotels' || activeTab === 'homestays' ? 'City, Area or Property' : activeTab === 'packages' ? 'To Destination' : 'To'}
              </span>
              <span className="field-value" style={{ fontSize: '24px' }}>{toLoc.city || 'Select'}</span>
              <span className="field-desc">{toLoc.airport || toLoc.desc || 'Destination'}</span>
              
              {showToSuggest && (
                <div className="suggest-dropdown" style={{ left: 0 }}>
                  {getToSuggestions().filter(s => s.code !== fromLoc.code).map((station) => (
                    <div 
                      key={station.code || station.city} 
                      className="suggest-item"
                      onClick={(e) => { e.stopPropagation(); setToLoc(station); setShowToSuggest(false); }}
                    >
                      <div className="suggest-city-details">
                        <span className="suggest-city">{station.city}</span>
                        <span className="suggest-airport">{station.airport || station.desc}</span>
                      </div>
                      {station.code ? <span className="suggest-code">{station.code}</span> : <span className="suggest-code">📍</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DEPARTURE DATE */}
            <div className="search-field-box">
              <span className="field-label">{activeTab === 'hotels' || activeTab === 'homestays' ? 'Check-In' : 'Departure'}</span>
              <span className="field-value" style={{ fontSize: '24px' }}>{formatDateText(departureDate)}</span>
              <span className="field-desc">{getWeekday(departureDate)}</span>
              <input 
                type="date" 
                className="hidden-date-input" 
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)} 
              />
            </div>

            {/* RETURN DATE (Only Flights/Hotels/Homestays) */}
            {(activeTab === 'flights' || activeTab === 'hotels' || activeTab === 'homestays') && (
              <div 
                className={`search-field-box ${(activeTab === 'flights' && tripType === 'one-way') ? 'disabled' : ''}`} 
                style={{ opacity: (activeTab === 'flights' && tripType === 'one-way') ? 0.5 : 1 }}
              >
                <span className="field-label">{activeTab === 'flights' ? 'Return' : 'Check-Out'}</span>
                <span className="field-value" style={{ fontSize: '24px' }}>
                  {activeTab === 'flights' && tripType === 'one-way' ? 'Book Return' : formatDateText(returnDate)}
                </span>
                <span className="field-desc">
                  {activeTab === 'flights' && tripType === 'one-way' ? 'Save more on round trip' : getWeekday(returnDate)}
                </span>
                {(activeTab !== 'flights' || tripType === 'round-trip') && (
                  <input 
                    type="date" 
                    className="hidden-date-input" 
                    value={returnDate}
                    min={departureDate}
                    onChange={(e) => setReturnDate(e.target.value)} 
                  />
                )}
              </div>
            )}

            {/* TRAVELLERS / GUESTS COUNTER */}
            {activeTab !== 'packages' && activeTab !== 'buses' && activeTab !== 'cabs' && activeTab !== 'trains' && (
              <div className="search-field-box" onClick={() => { setShowTravellers(true); setShowFromSuggest(false); setShowToSuggest(false); }}>
                <span className="field-label">Travellers & Class</span>
                <span className="field-value" style={{ fontSize: '24px' }}>
                  {activeTab === 'flights' ? `${adults + children} pax` : `${rooms} Room, ${guests} Guest`}
                </span>
                <span className="field-desc">
                  {activeTab === 'flights' ? travelClass : 'Adults & Children'}
                </span>
                
                {showTravellers && (
                  <div className="travellers-panel" onClick={(e) => e.stopPropagation()} style={{ right: 0 }}>
                    {activeTab === 'flights' ? (
                      <>
                        <div className="traveller-row">
                          <div className="traveller-info">
                            <span className="traveller-title">Adults</span>
                            <span className="traveller-sub">Aged 12+ years</span>
                          </div>
                          <div className="counter-controls">
                            <button className="counter-btn" disabled={adults <= 1} onClick={() => setAdults(adults - 1)}>-</button>
                            <span className="counter-val">{adults}</span>
                            <button className="counter-btn" onClick={() => setAdults(adults + 1)}>+</button>
                          </div>
                        </div>
                        <div className="traveller-row">
                          <div className="traveller-info">
                            <span className="traveller-title">Children</span>
                            <span className="traveller-sub">Aged 2-12 years</span>
                          </div>
                          <div className="counter-controls">
                            <button className="counter-btn" disabled={children <= 0} onClick={() => setChildren(children - 1)}>-</button>
                            <span className="counter-val">{children}</span>
                            <button className="counter-btn" onClick={() => setChildren(children + 1)}>+</button>
                          </div>
                        </div>
                        <div className="traveller-row">
                          <div className="traveller-info">
                            <span className="traveller-title">Class</span>
                          </div>
                          <select 
                            value={travelClass} 
                            onChange={(e) => setTravelClass(e.target.value)}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-light)' }}
                          >
                            <option>Economy</option>
                            <option>Premium Economy</option>
                            <option>Business</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="traveller-row">
                          <div className="traveller-info">
                            <span className="traveller-title">Rooms</span>
                          </div>
                          <div className="counter-controls">
                            <button className="counter-btn" disabled={rooms <= 1} onClick={() => setRooms(rooms - 1)}>-</button>
                            <span className="counter-val">{rooms}</span>
                            <button className="counter-btn" onClick={() => setRooms(rooms + 1)}>+</button>
                          </div>
                        </div>
                        <div className="traveller-row">
                          <div className="traveller-info">
                            <span className="traveller-title">Guests</span>
                          </div>
                          <div className="counter-controls">
                            <button className="counter-btn" disabled={guests <= 1} onClick={() => setGuests(guests - 1)}>-</button>
                            <span className="counter-val">{guests}</span>
                            <button className="counter-btn" onClick={() => setGuests(guests + 1)}>+</button>
                          </div>
                        </div>
                      </>
                    )}
                    <button 
                      className="btn-secondary" 
                      style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}
                      onClick={() => setShowTravellers(false)}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Special Fare Categories (Flights Only) */}
        {activeTab === 'flights' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-medium)' }}>Select A Special Fare:</span>
            {[
              { id: 'regular', label: 'Regular Fares' },
              { id: 'student', label: 'Student Fares' },
              { id: 'senior', label: 'Senior Citizen Fares' },
              { id: 'military', label: 'Armed Forces Fares' },
              { id: 'double', label: 'Double Seat Fares' }
            ].map(fare => (
              <button
                key={fare.id}
                onClick={() => setSpecialFare(fare.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: specialFare === fare.id ? 'var(--primary-color)' : 'var(--border-light)',
                  backgroundColor: specialFare === fare.id ? 'rgba(0,140,255,0.08)' : 'transparent',
                  color: specialFare === fare.id ? 'var(--primary-color)' : 'var(--text-medium)',
                  transition: 'all 0.2s'
                }}
              >
                {fare.label}
              </button>
            ))}
          </div>
        )}

        {/* SEARCH ACTION BUTTON */}
        <div className="search-btn-box" style={{ bottom: '-22px' }}>
          <button 
            className="btn-primary" 
            onClick={handleSearchSubmit}
            style={{
              padding: '14px 48px',
              fontSize: '18px',
              fontWeight: '800',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, #ff4f5a 0%, #ff758f 100%)',
              boxShadow: '0 6px 20px rgba(255,79,90,0.5)'
            }}
          >
            SEARCH
          </button>
        </div>

      </div>
    </div>
  );
}
