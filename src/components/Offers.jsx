import React, { useState } from 'react';
import { Tag, MapPin, Sparkles, Compass, ShieldCheck, ArrowRight, Play, Download, Smartphone } from 'lucide-react';
import { mockOffers } from '../data/mockDatabase';

const RECENT_SEARCHES = [
  { from: 'Surat', to: 'Varanasi', type: 'Flight', desc: '6 travellers', date: '12 - 16 Sep 26' },
  { from: 'Varanasi', to: 'Surat', type: 'Flight', desc: '6 travellers', date: '16 Oct 26' },
  { from: 'Surat', to: 'Lucknow', type: 'Flight', desc: '6 travellers', date: '12 Oct 26' },
  { from: 'Surat', to: 'Ayodhya', type: 'Flight', desc: '6 travellers', date: '12 Oct 26' },
  { from: 'Varanasi', to: 'Bengaluru', type: 'Flight', desc: '2 travellers', date: '27 Aug 26' }
];

const PROMO_CAROUSEL = [
  { img: '🏠', title: 'Explore Villas & Homestays', desc: 'Made for your kind of getaways! Book your FIRST stay @ FLAT 20% OFF*. Use Code: FIRSTHOMESTAY' },
  { img: '🔵', title: 'Introducing OneCircle', desc: 'Reward your stays across 11,000+ properties in 1000+ cities worldwide. 10% Reward Points on Member Stays.' },
  { img: '🌴', title: 'Flexible Check-in/ Check-out', desc: 'Early Check-in & Late Check-out on Stays. No waiting. No stressing. Just a smooth travel experience.' }
];

const VARANASI_HOTELS = [
  { name: 'Hotel Satsang Grand', area: 'Pandeypur', rating: '4.5/5', price: '₹1,395', stars: 3, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80' },
  { name: 'PEARL COURTYARD', area: 'Luxa Road', rating: '4.1/5', price: '₹6,376', stars: 4, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80' },
  { name: 'Tree of Life Resorts & Spa, Varanasi', area: 'Varanasi', rating: '4.1/5', price: '₹7,363', stars: 5, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80' },
  { name: 'Country Inn Varanasi', area: 'Mahmoorganj', rating: '4.2/5', price: '₹4,800', stars: 4, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80' }
];

const AIRLINE_PARTNERS = [
  { name: 'Air India', color: 'linear-gradient(135deg, #b31217 0%, #e52d27 100%)', code: 'AI' },
  { name: 'Air India Express', color: 'linear-gradient(135deg, #d35400 0%, #e67e22 100%)', code: 'IX' },
  { name: 'Etihad Airways', color: 'linear-gradient(135deg, #1c2833 0%, #2c3e50 100%)', code: 'EY' }
];

const FLAGSHIP_STORES = [
  { name: 'ITC Hotels Limited', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80' },
  { name: 'Sterling Hotels & Resorts', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&q=80' },
  { name: 'CGH Earth Experience Hotels', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Cinnamon Hotels', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80' }
];

const HANDPICKED_COLLECTIONS = [
  { title: 'Stays in & Around Delhi for a Weekend Getaway', count: 'TOP 8', img: 'https://images.unsplash.com/photo-1566837430541-00626e2e5058?auto=format&fit=crop&w=300&q=80' },
  { title: 'Stays in & Around Mumbai for a Weekend Getaway', count: 'TOP 8', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
  { title: 'Stays in & Around Bangalore for a Weekend Getaway', count: 'TOP 9', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=300&q=80' },
  { title: 'Beach Destinations', count: 'TOP 11', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=300&q=80' },
  { title: 'Weekend Getaways', count: 'TOP 11', img: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=300&q=80' }
];

const WONDERS_OF_INDIA = [
  { title: "Shimla's Best Kept Secret", desc: "Mashobra hill forests", img: "https://images.unsplash.com/photo-1566837430541-00626e2e5058?auto=format&fit=crop&w=300&q=80" },
  { title: "Tamil Nadu's Charming Hill Town", desc: "Kodaikanal lake getaways", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" },
  { title: "Picturesque Gateway to Himalayas", desc: "Dharamshala & Mcleodganj", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=300&q=80" },
  { title: "Quaint Little Hill Station in Gujarat", desc: "Saputara gardens view", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=300&q=80" },
  { title: "A pleasant summer retreat and winter wonderland!", desc: "Manali snow valleys", img: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=300&q=80" },
  { title: "Seaside Resort in West Bengal", desc: "Digha beach weekend", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80" }
];

export default function Offers() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [phoneNumber, setPhoneNumber] = useState('');

  const filteredOffers = mockOffers.filter(offer => {
    if (activeFilter === 'ALL') return true;
    return offer.title.includes(activeFilter);
  });

  return (
    <section className="offers-section container animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px 20px 60px 20px' }}>
      
      {/* 1. RECENT SEARCHES PANEL */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e6ebf3' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: '#1a1a1a' }}>Recent Searches</h3>
        <div className="recent-searches-scroll">
          {RECENT_SEARCHES.map((search, idx) => (
            <div key={idx} className="recent-search-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-primary" style={{ fontSize: '9px', padding: '2px 6px' }}>{search.type}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{search.date}</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginTop: '10px', color: '#1a1a1a' }}>
                {search.from} ➔ {search.to}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-medium)', marginTop: '4px' }}>
                {search.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MID-BANNER PROMOS CAROUSEL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {PROMO_CAROUSEL.map((promo, idx) => (
          <div key={idx} style={{ background: '#ffffff', border: '1px solid #e6ebf3', borderRadius: '12px', padding: '20px', display: 'flex', gap: '14px', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '32px', flexShrink: 0 }}>{promo.img}</span>
            <div>
              <h5 style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a' }}>{promo.title}</h5>
              <p style={{ fontSize: '11px', color: 'var(--text-medium)', marginTop: '4px', lineHeight: 1.4 }}>{promo.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. DOWNLOAD APP PANEL WITH QR CODE */}
      <div className="app-download-box">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '48px', color: 'var(--primary-color)' }}>📱</div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px' }}>Download App Now!</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
              Use code <strong>WELCOMEMMT</strong> and get <strong>FLAT 25% OFF*</strong> on your first Hotel booking.
            </p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#ffffff', overflow: 'hidden', width: '220px' }}>
                <span style={{ padding: '0 10px', fontSize: '12px', fontWeight: '700', borderRight: '1px solid #cbd5e1' }}>🇮🇳 +91</span>
                <input 
                  type="tel" 
                  placeholder="Enter Mobile number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  style={{ padding: '8px 12px', fontSize: '12px', width: '100%' }}
                />
              </div>
              <button 
                onClick={() => alert(`App link dispatched to +91-${phoneNumber}`)} 
                className="btn-primary" 
                style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
              >
                GET APP LINK
              </button>
            </div>
          </div>
        </div>

        {/* QR Code and Stores Graphic */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#000000', color: 'white', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '130px' }}>
              <span style={{ fontSize: '16px' }}>▶</span>
              <span style={{ fontSize: '8px', fontWeight: 'bold' }}>GET IT ON <strong style={{ display: 'block', fontSize: '10px' }}>Google Play</strong></span>
            </div>
            <div style={{ background: '#000000', color: 'white', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', width: '130px' }}>
              <span style={{ fontSize: '16px' }}>🍎</span>
              <span style={{ fontSize: '8px', fontWeight: 'bold' }}>Download on the <strong style={{ display: 'block', fontSize: '10px' }}>App Store</strong></span>
            </div>
          </div>

          <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="64" height="64" viewBox="0 0 100 100">
              <rect x="10" y="10" width="20" height="20" fill="black" />
              <rect x="70" y="10" width="20" height="20" fill="black" />
              <rect x="10" y="70" width="20" height="20" fill="black" />
              <rect x="35" y="35" width="30" height="30" fill="black" />
              <rect x="75" y="75" width="15" height="15" fill="black" />
              <rect x="45" y="75" width="15" height="15" fill="black" />
            </svg>
            <span style={{ fontSize: '8px', fontWeight: '700', color: 'var(--text-light)', marginTop: '4px' }}>SCAN QR CODE</span>
          </div>
        </div>
      </div>

      {/* 4. RECOMMENDED VARANASI HOTELS PANEL */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e6ebf3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>For your stay in Varanasi</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>Recommended premium hotels based on user booking feedback</p>
          </div>
          <button style={{ color: 'var(--primary-color)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>VIEW ALL ➔</button>
        </div>

        <div className="varanasi-hotels-grid">
          {VARANASI_HOTELS.map((hotel, idx) => (
            <div key={idx} className="v-hotel-card">
              <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
                <img src={hotel.img} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                  {hotel.rating}
                </span>
              </div>
              <div style={{ padding: '12px' }}>
                <h4 style={{ fontWeight: '700', fontSize: '13px', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={hotel.name}>
                  {hotel.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>{hotel.area}</p>
                <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginTop: '4px' }}>
                  {Array.from({ length: hotel.stars }).map((_, i) => <span key={i} style={{ fontSize: '10px' }}>★</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #e6ebf3', paddingTop: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>Per Night</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-dark)' }}>{hotel.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. OFFERS TABBED DISCOUNT SLIDER */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e6ebf3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a' }}>Handpicked Offers For You</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '4px', borderRadius: '24px' }}>
            {['ALL', 'FLIGHT', 'HOTEL', 'TRAIN', 'BUS'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '10px', fontWeight: '700',
                  color: activeFilter === tab ? 'var(--primary-color)' : 'var(--text-medium)',
                  background: activeFilter === tab ? '#ffffff' : 'transparent',
                  boxShadow: activeFilter === tab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="offers-grid">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="offer-card" style={{ background: offer.bg }}>
              <div className="offer-title">{offer.title}</div>
              <div className="offer-desc" style={{ fontSize: '15px' }}>{offer.desc}</div>
              <div className="offer-code-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={12} />
                  CODE:
                </span>
                <span className="offer-code">{offer.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. AIRLINE PARTNERS & FLAGSHIP STORES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e6ebf3', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: '#1a1a1a' }}>Experience Flying with our Airline Partners</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {AIRLINE_PARTNERS.map((partner, idx) => (
              <div key={idx} style={{ background: partner.color, color: 'white', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{partner.name}</span>
                <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: '700' }}>CODE: {partner.code}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e6ebf3', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px', color: '#1a1a1a' }}>Flagship Hotel Stores on MakeMyTrip</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {FLAGSHIP_STORES.map((store, idx) => (
              <div key={idx} className="flagship-card">
                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <img src={store.img} alt={store.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '8px', fontWeight: '700', fontSize: '11px', textAlign: 'center', color: '#1a1a1a' }}>
                  {store.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. HANDPICKED COLLECTIONS */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e6ebf3' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px' }}>Handpicked Collections for You</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {HANDPICKED_COLLECTIONS.map((col, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: '1px solid #e6ebf3', borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              <div style={{ height: '100px', overflow: 'hidden' }}>
                <img src={col.img} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px' }}>
                <span className="badge badge-primary" style={{ fontSize: '8px', padding: '2px 4px', fontWeight: 'bold' }}>{col.count}</span>
                <h5 style={{ fontWeight: '700', fontSize: '10px', color: 'var(--text-dark)', marginTop: '4px', lineHeight: 1.3, height: '36px', overflow: 'hidden' }}>{col.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. WONDERS OF INDIA CAROUSEL (Screenshot 4) */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e6ebf3' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a1a', marginBottom: '4px' }}>Unlock Lesser-Known Wonders of India</h3>
        <p style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '16px' }}>Vibrant hidden getaways and valleys worth exploring on road trips</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
          {WONDERS_OF_INDIA.map((wonder, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: '1px solid #e6ebf3', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ height: '90px', overflow: 'hidden' }}>
                <img src={wonder.img} alt={wonder.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px' }}>
                <h5 style={{ fontWeight: '700', fontSize: '10px', color: 'var(--text-dark)', lineHeight: 1.3, height: '36px', overflow: 'hidden' }}>{wonder.title}</h5>
                <p style={{ fontSize: '8px', color: 'var(--text-light)', marginTop: '2px' }}>{wonder.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. WHY MAKEMYTRIP - 3-COLUMN DESCRIPTION SECTION (Screenshot 1 & 2) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', 
        padding: '30px 0', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', 
        fontSize: '11px', color: '#4a4a4a', lineHeight: 1.6, textAlign: 'left'
      }}>
        <div>
          <h4 style={{ fontWeight: '700', fontSize: '12px', color: '#1a1a1a', marginBottom: '10px' }}>Why MakeMyTrip?</h4>
          <p>
            Established in 2000, MakeMyTrip has since positioned itself as one of the leading travel companies, providing great offers, competitive airfares, exclusive discounts, and a seamless online booking experience to many of its customers. The experience of booking your flight tickets, hotel stay, and holiday package through our desktop site or mobile app can be done with complete ease and no hassles at all. We also deliver amazing offers, such as Instant Discounts, Fare Calendar, MyRewardsProgram, MyWallet, and many more while updating them from time to time to better suit our customers' evolving needs and demands.
          </p>
        </div>
        <div>
          <h4 style={{ fontWeight: '700', fontSize: '12px', color: '#1a1a1a', marginBottom: '10px' }}>Booking Flights with MakeMyTrip</h4>
          <p>
            At MakeMyTrip, you can find the best of deals and cheap air tickets to any place you want by booking your tickets on our website or app. Being India's leading website for hotel, flight, and holiday bookings, MakeMyTrip helps you book flight tickets that are affordable and customized to your convenience. With customer satisfaction being our ultimate goal, we also have a 24/7 dedicated helpline to cater to our customer's queries and concerns. Serving over 5 million happy customers, we at MakeMyTrip are glad to fulfill the dreams of folks who need a quick and easy means to find air tickets. You can get a hold of the cheapest flight of your choice today while also enjoying the other available options for your travel needs with us.
          </p>
        </div>
        <div>
          <h4 style={{ fontWeight: '700', fontSize: '12px', color: '#1a1a1a', marginBottom: '10px' }}>Domestic Flights with MakeMyTrip</h4>
          <p>
            MakeMyTrip is India's leading player for flight bookings. With the cheapest fare guarantee, experience great value at the lowest price. Instant notifications ensure current flight status, instant fare drops, amazing discounts, instant refunds and rebook options, price comparisons and many more interesting features.
          </p>
        </div>
      </div>

      {/* 10. COMPREHENSIVE FOOTER LINKS RENDERER (Screenshot 2 & 3) */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '10px', 
        color: '#7f7f7f', lineHeight: 1.5, textAlign: 'left', paddingBottom: '20px'
      }}>
        <div>
          <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>MAKEMYTRIP</strong>
          <span>About Us, Investor Relations, Careers, Sustainability, MMT Foundation, Legal Notices, CSR Policy & Committee, myBiz for Corporate Travel, myPartner - Travel Agent Portal, List your hotel, Partners- Redbus, Partners- Goibibo, Advertise with Us, Holiday-Franchise, Partners- BookMyForex, RedBus Ferry Malaysia, RedBus Ferry Singapore, redBus Vietnam, redBus Cambodia, redBus Columbia, redBus Peru, redBus Indonesia, Things to Do in Malaysia, Things to Do in Singapore</span>
        </div>

        <div>
          <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>PRODUCT OFFERING</strong>
          <span>Flights, International Flights, Charter Flights, Hotels, International Hotels, Apply Visa Online, Homestays and Villas, Activities, Holidays In India, International Holidays, Book Hotels From UAE, Book Online Cabs, Book Bus Tickets, Book Train Tickets, Cheap Tickets to India, Book Flights From US, Book Flights From UAE, Trip Planner, Forex Card, Buy Foreign Currency, Travel Insurance, Travel Insurance Thailand, Travel Insurance For UAE, Travel Insurance For Indonesia, Travel Insurance For Vietnam, Travel Insurance For Europe, Travel Insurance For USA, Travel Insurance For Singapore, Travel Insurance For Malaysia, Travel Insurance For Sri Lanka, Travel Insurance For United Kingdom, Travel Insurance For Canada, Gift Cards, Gift, Wedding Gift, Anniversary Gift, Birthday Gift, Diwali Gift, Valentines Gift, Farewell Gift, Christmas Gift, New Year Gift, Trip Ideas, Travel Blog, PNR Status, MakeMyTrip Advertising Solutions, One Way Cab, Travel Credit Card</span>
        </div>

        <div>
          <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>TOP HOTELS IN INDIA</strong>
          <span>Fairmont Jaipur, St Regis Goa, Six Senses Fort Barwara, W Goa, Grand Hyatt Goa, Shangri-La Bangalore, The St Regis Mumbai, Taj Rishikesh, Grand Hyatt Mumbai, Le Meridien Delhi, Rambagh Palace Jaipur, Leela Palace Chennai, The Leela Palace Udaipur, Taj Lake Palace Udaipur, Jw Marriott Chandigarh, Alila Diwa Goa, Le Meridien Goa, Taj Lands End Mumbai, Itc Grand Chola Chennai, Itc Maratha Mumbai, Oberoi Udaivilas, Jai Mahal Palace Jaipur, Taj Mahal Tower Mumbai, Marriott Suites Pune, Park Hyatt Chennai, The Leela Palace Jaipur, Jw Marriott Mumbai Sahar, Jw Marriott Mumbai Juhu, The Ritz Carlton Bengaluru, The Oberoi New Delhi, Taj Resort & Convention Centre Goa, Taj Bengal Kolkata, Taj Coromandel Chennai, The Oberoi Gurgaon, The Westin Goa, Jw Marriott Hotel Pune, The Leela Palace New Delhi, Taj West End Bengaluru, The Taj Mahal Palace Mumbai, Best Hotels in India</span>
        </div>

        <div>
          <strong style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>INTERNATIONAL ROUTES</strong>
          <span>Delhi to Dubai flight, Mumbai to Dubai Flight, Ahmedabad to London flight, Delhi to Bali flight, Delhi to London flight, Delhi to Bangkok flight, Delhi to Kathmandu flight, Delhi to Singapore flight, Mumbai to London flight, Mumbai to Bali flight, Mumbai to Bangkok flight, Ahmedabad to Dubai Flight, Bangalore to Dubai flight, Chennai to Dubai flight, Delhi to Phuket flight</span>
        </div>
      </div>

    </section>
  );
}
