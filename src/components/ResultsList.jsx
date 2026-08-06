import React, { useState, useEffect } from 'react';
import { Filter, Star, MapPin, Compass, ShieldCheck, AlertCircle } from 'lucide-react';
import { mockFlights, mockTrains, mockBuses } from '../data/mockDatabase';
import { dbGetHotels, dbGetPackages } from '../data/dbService';

export default function ResultsList({ searchParams, onSelectItem }) {
  const { tab, from, to, departureDate } = searchParams;
  
  // States
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [maxPriceFilter, setMaxPriceFilter] = useState(150000);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  
  // Sidebar Filters
  const [stopsFilter, setStopsFilter] = useState({ zero: false, one: false }); // Flights
  const [ratingFilter, setRatingFilter] = useState({ high: false, good: false }); // All
  const [starsFilter, setStarsFilter] = useState({ five: false, four: false, three: false }); // Hotels
  const [packageTypeFilter, setPackageTypeFilter] = useState({ domestic: false, international: false }); // Packages
  
  // Hotel Amenities Filters (Layer 4 checklist)
  const [amenitiesFilter, setAmenitiesFilter] = useState({
    wifi: false,
    pool: false,
    beach: false,
    gym: false
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('price-asc');

  // Load and query data
  useEffect(() => {
    const fetchData = async () => {
      let sourceData = [];
      if (tab === 'flights') {
        const match = mockFlights.filter(
          f => f.from.toLowerCase().includes(from?.city?.toLowerCase() || '') &&
               f.to.toLowerCase().includes(to?.city?.toLowerCase() || '')
        );
        sourceData = match.length > 0 ? match : mockFlights;
      } else if (tab === 'hotels') {
        const dbHotels = await dbGetHotels();
        const approvedHotels = dbHotels.filter(h => h.status === 'approved');
        const match = approvedHotels.filter(
          h => h.city.toLowerCase().includes(to?.city?.toLowerCase() || '')
        );
        sourceData = match.length > 0 ? match : approvedHotels;
      } else if (tab === 'trains') {
        const match = mockTrains.filter(
          t => t.from.toLowerCase().includes(from?.city?.toLowerCase() || '') &&
               t.to.toLowerCase().includes(to?.city?.toLowerCase() || '')
        );
        sourceData = match.length > 0 ? match : mockTrains;
      } else if (tab === 'buses') {
        const match = mockBuses.filter(
          b => b.from.toLowerCase().includes(from?.city?.toLowerCase() || '') &&
               b.to.toLowerCase().includes(to?.city?.toLowerCase() || '')
        );
        sourceData = match.length > 0 ? match : mockBuses;
      } else if (tab === 'packages') {
        const dbPackages = await dbGetPackages();
        const approvedPackages = dbPackages.filter(p => p.status === 'approved');
        const match = approvedPackages.filter(
          p => p.destination.toLowerCase().includes(to?.city?.toLowerCase() || '')
        );
        sourceData = match.length > 0 ? match : approvedPackages;
      }

      if (sourceData.length > 0) {
        const prices = sourceData.map(item => item.price || (item.classes ? item.classes[0].price : 0));
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(min);
        setMaxPrice(max);
        setMaxPriceFilter(max + 1000); 
      }
      
      setItems(sourceData);
    };

    fetchData();
  }, [searchParams, tab]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...items];

    // 1. Price Filter
    result = result.filter(item => {
      const price = item.price || (item.classes ? item.classes[0].price : 0);
      return price <= maxPriceFilter;
    });

    // 2. Stops Filter (Flights only)
    if (tab === 'flights') {
      const { zero, one } = stopsFilter;
      if (zero || one) {
        result = result.filter(item => {
          if (zero && item.stops === 0) return true;
          if (one && item.stops === 1) return true;
          return false;
        });
      }
    }

    // 3. Ratings Filter
    const { high, good } = ratingFilter;
    if (high || good) {
      result = result.filter(item => {
        const rating = item.rating || 0;
        if (high && rating >= 4.5) return true;
        if (good && rating >= 4.0 && rating < 4.5) return true;
        return false;
      });
    }

    // 4. Star Ratings (Hotels only)
    if (tab === 'hotels') {
      const { five, four, three } = starsFilter;
      if (five || four || three) {
        result = result.filter(item => {
          if (five && item.stars === 5) return true;
          if (four && item.stars === 4) return true;
          if (three && item.stars === 3) return true;
          return false;
        });
      }
    }

    // 5. Hotel Amenities Filters
    if (tab === 'hotels') {
      const { wifi, pool, beach, gym } = amenitiesFilter;
      if (wifi || pool || beach || gym) {
        result = result.filter(item => {
          const itemAmenities = item.amenities.map(a => a.toLowerCase());
          if (wifi && !itemAmenities.some(a => a.includes('wifi'))) return false;
          if (pool && !itemAmenities.some(a => a.includes('pool'))) return false;
          if (beach && !itemAmenities.some(a => a.includes('beach'))) return false;
          if (gym && !itemAmenities.some(a => a.includes('gym') || a.includes('fitness'))) return false;
          return true;
        });
      }
    }

    // 6. Package Type (Packages only)
    if (tab === 'packages') {
      const { domestic, international } = packageTypeFilter;
      if (domestic || international) {
        result = result.filter(item => {
          if (domestic && item.type === 'domestic') return true;
          if (international && item.type === 'international') return true;
          return false;
        });
      }
    }

    // 7. Sort
    result.sort((a, b) => {
      const priceA = a.price || (a.classes ? a.classes[0].price : 0);
      const priceB = b.price || (b.classes ? b.classes[0].price : 0);
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating-desc') return ratingB - ratingA;
      return 0;
    });

    setFilteredItems(result);
  }, [items, maxPriceFilter, stopsFilter, ratingFilter, starsFilter, amenitiesFilter, packageTypeFilter, sortBy, tab]);

  // Train class selection helper
  const handleTrainBook = (train, trainClass) => {
    onSelectItem({
      ...train,
      selectedClass: trainClass.type,
      selectedClassPrice: trainClass.price,
      pnr: "PNR" + Math.floor(Math.random() * 900000 + 100000)
    });
  };

  const handleMapAlert = (e, hotelName) => {
    e.stopPropagation();
    alert(`Showing Map coordinates for ${hotelName} - Redirecting to Google Maps location finder.`);
  };

  return (
    <div className="results-page-wrapper container animate-fade-in-up">
      <div className="results-grid">
        
        {/* Sticky Filters Sidebar */}
        <aside className="filter-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <Filter size={16} style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'var(--font-display)' }}>FILTER BY</span>
          </div>

          {/* Price Range Slider */}
          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <input 
              type="range" 
              className="range-input"
              min={minPrice} 
              max={maxPrice} 
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
            />
            <div className="price-slider-info">
              <span>₹{minPrice.toLocaleString('en-IN')}</span>
              <span>₹{maxPriceFilter.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Hotel Amenities Filters (Layer 4 checklist) */}
          {tab === 'hotels' && (
            <div className="filter-section">
              <h4 className="filter-title">Hotel Amenities</h4>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={amenitiesFilter.wifi} 
                  onChange={(e) => setAmenitiesFilter({ ...amenitiesFilter, wifi: e.target.checked })} 
                />
                Free WiFi
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={amenitiesFilter.pool} 
                  onChange={(e) => setAmenitiesFilter({ ...amenitiesFilter, pool: e.target.checked })} 
                />
                Swimming Pool
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={amenitiesFilter.beach} 
                  onChange={(e) => setAmenitiesFilter({ ...amenitiesFilter, beach: e.target.checked })} 
                />
                Private Beach
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={amenitiesFilter.gym} 
                  onChange={(e) => setAmenitiesFilter({ ...amenitiesFilter, gym: e.target.checked })} 
                />
                Fitness Center/Gym
              </label>
            </div>
          )}

          {/* Stops (Flights only) */}
          {tab === 'flights' && (
            <div className="filter-section">
              <h4 className="filter-title">Stops</h4>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={stopsFilter.zero} 
                  onChange={(e) => setStopsFilter({ ...stopsFilter, zero: e.target.checked })} 
                />
                Non Stop
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={stopsFilter.one} 
                  onChange={(e) => setStopsFilter({ ...stopsFilter, one: e.target.checked })} 
                />
                1 Stop
              </label>
            </div>
          )}

          {/* Star Rating (Hotels only) */}
          {tab === 'hotels' && (
            <div className="filter-section">
              <h4 className="filter-title">Hotel Star Rating</h4>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={starsFilter.five} 
                  onChange={(e) => setStarsFilter({ ...starsFilter, five: e.target.checked })} 
                />
                5 Star Luxury
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={starsFilter.four} 
                  onChange={(e) => setStarsFilter({ ...starsFilter, four: e.target.checked })} 
                />
                4 Star Premium
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={starsFilter.three} 
                  onChange={(e) => setStarsFilter({ ...starsFilter, three: e.target.checked })} 
                />
                3 Star Economy
              </label>
            </div>
          )}

          {/* Ratings (All, except Trains) */}
          {tab !== 'trains' && (
            <div className="filter-section">
              <h4 className="filter-title">Customer Rating</h4>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={ratingFilter.high} 
                  onChange={(e) => setRatingFilter({ ...ratingFilter, high: e.target.checked })} 
                />
                Excellent (4.5+)
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={ratingFilter.good} 
                  onChange={(e) => setRatingFilter({ ...ratingFilter, good: e.target.checked })} 
                />
                Good (4.0+)
              </label>
            </div>
          )}

          {/* Package Categories */}
          {tab === 'packages' && (
            <div className="filter-section">
              <h4 className="filter-title">Holiday Type</h4>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={packageTypeFilter.domestic} 
                  onChange={(e) => setPackageTypeFilter({ ...packageTypeFilter, domestic: e.target.checked })} 
                />
                Domestic Tour
              </label>
              <label className="filter-option">
                <input 
                  type="checkbox" 
                  checked={packageTypeFilter.international} 
                  onChange={(e) => setPackageTypeFilter({ ...packageTypeFilter, international: e.target.checked })} 
                />
                International Tour
              </label>
            </div>
          )}

        </aside>

        {/* Listings Section */}
        <main className="listings-container">
          
          {/* Header Row: Count & Sort */}
          <div className="listings-header">
            <div className="listings-count">
              Found {filteredItems.length} {tab} options
            </div>
            
            <div className="sort-selector-row">
              <span style={{ color: 'var(--text-light)', fontWeight: '600' }}>SORT BY:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="price-asc">Price (Lowest first)</option>
                <option value="price-desc">Price (Highest first)</option>
                <option value="rating-desc">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Empty search fallback */}
          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <AlertCircle size={40} style={{ color: 'var(--secondary-color)', marginBottom: '12px' }} />
              <h4 style={{ fontWeight: '700', fontSize: '16px' }}>No direct matches found</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px' }}>Adjust your filters or reset the price sliders to view options.</p>
              <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => setMaxPriceFilter(maxPrice + 1000)}>Reset Filters</button>
            </div>
          )}

          {/* Render loop */}
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              
              {/* Flight Card */}
              {tab === 'flights' && (
                <div className="flight-card-layout">
                  <div className="airline-info">
                    <span className="airline-logo">{item.logo}</span>
                    <div>
                      <div className="airline-name">{item.airline}</div>
                      <div className="airline-no">{item.flightNo}</div>
                    </div>
                  </div>
                  <div className="flight-time-box">
                    <span className="time-val">{item.departureTime}</span>
                    <span className="city-val">{item.from}</span>
                  </div>
                  <div className="flight-duration-box">
                    <span className="duration-val">{item.duration}</span>
                    <div className="stops-line">
                      {item.stops > 0 && <span className="stops-dot" />}
                    </div>
                    <span className="stops-desc">{item.stops === 0 ? 'Non Stop' : `${item.stops} Stop`}</span>
                  </div>
                  <div className="flight-time-box">
                    <span className="time-val">{item.arrivalTime}</span>
                    <span className="city-val">{item.to}</span>
                  </div>
                  <div className="flight-price-col">
                    <span className="price-title">Per Adult</span>
                    <div className="price-val">₹{item.price.toLocaleString('en-IN')}</div>
                    <button className="btn-secondary" style={{ marginTop: '8px' }} onClick={() => onSelectItem(item)}>Book Now</button>
                  </div>
                </div>
              )}

              {/* Hotel Card (Layer 4 visual enhancements) */}
              {tab === 'hotels' && (
                <div className="hotel-card-layout">
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.name} className="hotel-image" />
                    
                    {/* MakeMyTrip Trust Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'linear-gradient(90deg, #0a2240 0%, #153965 100%)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <ShieldCheck size={12} style={{ color: '#008cff' }} />
                      MMT Double Guarantee
                    </div>
                  </div>

                  <div className="hotel-details">
                    <div className="hotel-info-side">
                      <div>
                        <div className="hotel-stars">
                          {Array.from({ length: item.stars }).map((_, i) => (
                            <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                          ))}
                        </div>
                        <h3 className="hotel-name">{item.name}</h3>
                        
                        {/* Location map link */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0 10px 0' }}>
                          <MapPin size={12} style={{ color: 'var(--text-light)' }} />
                          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{item.address}</span>
                          <span 
                            onClick={(e) => handleMapAlert(e, item.name)}
                            style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', marginLeft: '6px' }}
                          >
                            Show on Map
                          </span>
                        </div>
                      </div>
                      
                      <div className="hotel-amenities-row">
                        {item.amenities.slice(0, 4).map((am, i) => (
                          <span key={i} className="amenity-tag">{am}</span>
                        ))}
                      </div>
                    </div>

                    <div className="hotel-rating-price-side">
                      <div className="hotel-rating-box">
                        <div className="rating-text-desc">
                          <span className="rating-desc">{item.rating >= 4.5 ? 'Excellent' : 'Very Good'}</span>
                          <span className="rating-count">{item.reviewsCount} reviews</span>
                        </div>
                        <div className="rating-badge">{item.rating}</div>
                      </div>
                      
                      <div className="hotel-price-box">
                        {/* Price breakdown and calculations */}
                        <span style={{ textDecoration: 'line-through', fontSize: '12px', color: 'var(--text-light)', marginRight: '6px' }}>
                          ₹{Math.round(item.price * 1.25).toLocaleString('en-IN')}
                        </span>
                        <span className="badge badge-secondary" style={{ fontSize: '9px', padding: '2px 6px', verticalAlign: 'middle' }}>20% OFF</span>
                        
                        <div className="price-val" style={{ marginTop: '2px' }}>₹{item.price.toLocaleString('en-IN')}</div>
                        <span className="per-night-label">+ ₹{Math.round(item.price * 0.18).toLocaleString('en-IN')} taxes & fees</span>
                        
                        <button className="btn-secondary" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }} onClick={() => onSelectItem(item)}>View Room Options</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Train Card */}
              {tab === 'trains' && (
                <div className="train-card-layout">
                  <div className="train-header-row">
                    <div className="train-identity">
                      <span className="train-number">{item.trainNo}</span>
                      <span className="train-name-val">{item.name}</span>
                    </div>
                    <span className="train-runs">Runs on: {item.runsOn.join(', ')}</span>
                  </div>
                  <div className="train-schedule-grid">
                    <div className="flight-time-box">
                      <span className="time-val">{item.departureTime}</span>
                      <span className="city-val">{item.from}</span>
                    </div>
                    <div className="flight-duration-box" style={{ width: '100px' }}>
                      <span className="duration-val">{item.duration}</span>
                      <div className="stops-line" />
                    </div>
                    <div className="flight-time-box">
                      <span className="time-val">{item.arrivalTime}</span>
                      <span className="city-val">{item.to}</span>
                    </div>
                  </div>
                  
                  {/* Class options list */}
                  <div className="train-classes-container">
                    {item.classes.map((cls) => (
                      <div 
                        key={cls.type} 
                        className="train-class-card"
                        onClick={() => handleTrainBook(item, cls)}
                      >
                        <div className="train-class-type">{cls.type}</div>
                        <div className="train-class-price">₹{cls.price}</div>
                        <div className="train-class-seats">Available: {cls.seats}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bus Card */}
              {tab === 'buses' && (
                <div className="bus-card-layout">
                  <div className="bus-info">
                    <span className="bus-operator">{item.operator}</span>
                    <span className="bus-type">{item.type}</span>
                  </div>
                  <div className="flight-time-box">
                    <span className="time-val">{item.departureTime}</span>
                    <span className="city-val">{item.from}</span>
                  </div>
                  <div className="flight-duration-box" style={{ width: '100px' }}>
                    <span className="duration-val">{item.duration}</span>
                    <div className="stops-line" />
                  </div>
                  <div className="flight-time-box">
                    <span className="time-val">{item.arrivalTime}</span>
                    <span className="city-val">{item.to}</span>
                  </div>
                  <div className="bus-rating-pill">
                    ★ {item.rating}
                  </div>
                  <div className="flight-price-col" style={{ gridColumn: 'span 1' }}>
                    <div className="price-val">₹{item.price}</div>
                    <div className="per-night-label">{item.seatsAvailable} seats left</div>
                    <button className="btn-secondary" style={{ marginTop: '8px' }} onClick={() => onSelectItem(item)}>Select Seats</button>
                  </div>
                </div>
              )}

              {/* Package Card */}
              {tab === 'packages' && (
                <div className="package-card-layout">
                  <div className="package-img-col">
                    <img src={item.image} alt={item.title} className="package-image" />
                    <span className="badge badge-primary package-type-badge">{item.type}</span>
                  </div>
                  <div className="package-details-col">
                    <div className="package-top-info">
                      <div>
                        <span className="package-duration">{item.duration}</span>
                        <h3 className="package-title">{item.title}</h3>
                      </div>
                      <div className="hotel-rating-box">
                        <span className="rating-desc">★★★★★</span>
                        <span className="rating-count">({item.reviewsCount})</span>
                      </div>
                    </div>
                    
                    <div className="package-highlights-list">
                      {item.highlights.map((h, i) => (
                        <span key={i} className="highlight-tag">✦ {h}</span>
                      ))}
                    </div>

                    <div className="package-inclusions">
                      {item.inclusions.map((inc, i) => (
                        <span key={i} className="inclusion-item">✓ {inc}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px' }}>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Tour inclusions: flights, hotels, breakfasts & dinners</span>
                      </div>
                      <div className="package-price-side">
                        <span className="price-title">Per Person</span>
                        <div className="price-val">₹{item.price.toLocaleString('en-IN')}</div>
                        <button className="btn-secondary" style={{ marginTop: '8px' }} onClick={() => onSelectItem(item)}>Book Package</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}

        </main>

      </div>
    </div>
  );
}
