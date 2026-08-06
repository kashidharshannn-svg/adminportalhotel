import React, { useState, useEffect } from 'react';
import { 
  dbRegisterUser, 
  dbLoginUser, 
  dbAddHotel, 
  dbAddPackage, 
  dbGetHotels, 
  dbGetPackages, 
  dbGetBookingsForVendor,
  dbGetPendingListings,
  dbUpdateListingStatus
} from '../data/dbService';
import { ShieldCheck, PlusCircle, LayoutGrid, ClipboardList, LogOut, Lock, Mail, Hotel, Palmtree, User } from 'lucide-react';

export default function VendorPortal({ isOpen, onClose }) {
  const [vendorUser, setVendorUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hotel_owner'); // 'hotel_owner', 'tour_operator', or 'admin'

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState('add_product'); // 'add_product', 'inventory', 'bookings', 'admin_pending'

  // Hotel Upload Form State
  const [hotelName, setHotelName] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelStars, setHotelStars] = useState('3');
  const [hotelPrice, setHotelPrice] = useState('');
  const [hotelImage, setHotelImage] = useState('');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelAmenities, setHotelAmenities] = useState('Free WiFi, Swimming Pool, Room Service');

  // Package Upload Form State
  const [packageTitle, setPackageTitle] = useState('');
  const [packageDest, setPackageDest] = useState('');
  const [packageDuration, setPackageDuration] = useState('4 Nights / 5 Days');
  const [packagePrice, setPackagePrice] = useState('');
  const [packageImage, setPackageImage] = useState('');
  const [packageHighlights, setPackageHighlights] = useState('Sightseeing Cab, Houseboat Stay, Local Guide');
  const [packageInclusions, setPackageInclusions] = useState('3 Star Hotel, Daily Breakfast, Airport Transfers');

  // Database lists states
  const [inventoryList, setInventoryList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);

  if (!isOpen) return null;

  // Load inventory and bookings when vendor logged in
  const loadDashboardData = async (user) => {
    try {
      if (user.role === 'admin') {
        const pending = await dbGetPendingListings();
        setInventoryList(pending);
      } else if (user.role === 'hotel_owner') {
        const list = await dbGetHotels();
        setInventoryList(list.filter(h => h.vendorId === user.uid));
        const bookings = await dbGetBookingsForVendor(user.uid);
        setBookingsList(bookings);
      } else if (user.role === 'tour_operator') {
        const list = await dbGetPackages();
        setInventoryList(list.filter(p => p.vendorId === user.uid));
        const bookings = await dbGetBookingsForVendor(user.uid);
        setBookingsList(bookings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (vendorUser) {
      loadDashboardData(vendorUser);
    }
  }, [vendorUser, activeTab]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        const user = await dbLoginUser(email, password);
        setVendorUser(user);
        if (user.role === 'admin') {
          setActiveTab('admin_pending');
        } else {
          setActiveTab('add_product');
        }
      } else {
        const user = await dbRegisterUser(email, password, role);
        setVendorUser(user);
        setActiveTab('add_product');
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setVendorUser(null);
    setInventoryList([]);
    setBookingsList([]);
    setActiveTab('add_product');
  };

  const handleApproveReject = async (itemId, type, status) => {
    try {
      await dbUpdateListingStatus(itemId, type, status);
      alert(`Listing has been successfully ${status === 'approved' ? 'Approved ✅' : 'Rejected ❌'}!`);
      loadDashboardData(vendorUser);
    } catch (err) {
      alert(err.message);
    }
  };

  // Upload Property
  const handleHotelUpload = async (e) => {
    e.preventDefault();
    if (!hotelName || !hotelCity || !hotelPrice) {
      alert("Please fill in Name, City and Price!");
      return;
    }
    const imageUrl = hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
    
    const hotelObj = {
      name: hotelName,
      city: hotelCity,
      address: hotelAddress,
      stars: Number(hotelStars),
      price: Number(hotelPrice),
      image: imageUrl,
      description: hotelDescription || "A luxury hospitality property listed under MakeMyTrip marketplace.",
      amenities: hotelAmenities.split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      await dbAddHotel(hotelObj, vendorUser.uid);
      alert("Property submitted for verification! It will go live once verified by MakeMyTrip Admin.");
      setHotelName('');
      setHotelCity('');
      setHotelAddress('');
      setHotelPrice('');
      setHotelImage('');
      setHotelDescription('');
      setActiveTab('inventory');
    } catch (err) {
      alert(err.message);
    }
  };

  // Upload Holiday Tour Package
  const handlePackageUpload = async (e) => {
    e.preventDefault();
    if (!packageTitle || !packageDest || !packagePrice) {
      alert("Please fill in Title, Destination and Price!");
      return;
    }
    const imageUrl = packageImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
    
    const packageObj = {
      type: "domestic",
      destination: packageDest,
      title: packageTitle,
      duration: packageDuration,
      price: Number(packagePrice),
      image: imageUrl,
      highlights: packageHighlights,
      inclusions: packageInclusions
    };

    try {
      await dbAddPackage(packageObj, vendorUser.uid);
      alert("Tour Package submitted for verification! It will go live once verified by MakeMyTrip Admin.");
      setPackageTitle('');
      setPackageDest('');
      setPackagePrice('');
      setPackageImage('');
      setActiveTab('inventory');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-in" style={{ width: '90%', maxWidth: '1000px', height: '85vh', gridTemplateRows: 'auto 1fr' }}>
        
        {/* Header bar */}
        <div className="modal-header" style={{ background: '#0a2240', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} style={{ color: '#008cff' }} />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>MakeMyTrip B2B Business Portal</h3>
              <span style={{ fontSize: '10px', color: '#a3b8cc' }}>Multi-Vendor Properties & Packages Management Console</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} style={{ color: 'white' }}>
            <X size={24} />
          </button>
        </div>

        {/* Main Body */}
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
          
          {/* Guest/Sign-in state */}
          {!vendorUser ? (
            <div style={{ margin: 'auto', width: '100%', maxWidth: '400px', padding: '30px', background: '#ffffff', borderRadius: '12px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,140,255,0.08)', color: 'var(--primary-color)', marginBottom: '10px' }}>
                  💼
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '20px' }}>{isLoginView ? "B2B Merchant Login" : "B2B Merchant Sign Up"}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>List your properties or tour packages on MakeMyTrip</p>
              </div>

              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} /> Email Address
                  </label>
                  <input type="email" required placeholder="business@hotel.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                
                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={12} /> Password
                  </label>
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                {!isLoginView && (
                  <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={12} /> I want to sell:
                    </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="hotel_owner">Hotels / Stays / Rooms</option>
                      <option value="tour_operator">Holiday Tour Packages</option>
                    </select>
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                  {isLoginView ? "Sign In to Console" : "Create Seller Account"}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-medium)' }}>
                {isLoginView ? "New to MakeMyTrip business?" : "Already registered as seller?"}{' '}
                <button 
                  style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'underline' }}
                  onClick={() => setIsLoginView(!isLoginView)}
                >
                  {isLoginView ? "Register Now" : "Sign In Here"}
                </button>
              </div>
            </div>
          ) : (
            
            /* Logged in state dashboard */
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', width: '100%', height: '100%' }}>
              
              {/* Dashboard Left Sidebar */}
              <div style={{ background: 'var(--bg-input)', borderRight: '1px solid var(--border-light)', padding: '20px', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Vendor Welcome Card */}
                  <div style={{ padding: '14px', background: 'white', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
                      {vendorUser.role === 'admin' ? 'MMT Administrator' : vendorUser.role === 'hotel_owner' ? 'Hotel Partner' : 'Tour Operator'}
                    </span>
                    <div style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '4px' }}>
                      {vendorUser.email}
                    </div>
                  </div>

                  {vendorUser.role === 'admin' ? (
                    /* Admin Options */
                    <button
                      onClick={() => setActiveTab('admin_pending')}
                      style={{
                        padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: activeTab === 'admin_pending' ? 'var(--primary-color)' : 'transparent',
                        color: activeTab === 'admin_pending' ? 'white' : 'var(--text-medium)'
                      }}
                    >
                      <ShieldCheck size={14} />
                      <span>Pending Approvals</span>
                    </button>
                  ) : (
                    /* Regular Vendor Options */
                    <>
                      <button
                        onClick={() => setActiveTab('add_product')}
                        style={{
                          padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: activeTab === 'add_product' ? 'var(--primary-color)' : 'transparent',
                          color: activeTab === 'add_product' ? 'white' : 'var(--text-medium)'
                        }}
                      >
                        <PlusCircle size={14} />
                        <span>Upload Product</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('inventory')}
                        style={{
                          padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: activeTab === 'inventory' ? 'var(--primary-color)' : 'transparent',
                          color: activeTab === 'inventory' ? 'white' : 'var(--text-medium)'
                        }}
                      >
                        <LayoutGrid size={14} />
                        <span>My Inventory</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('bookings')}
                        style={{
                          padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: activeTab === 'bookings' ? 'var(--primary-color)' : 'transparent',
                          color: activeTab === 'bookings' ? 'white' : 'var(--text-medium)'
                        }}
                      >
                        <ClipboardList size={14} />
                        <span>Merchant Sales ({bookingsList.length})</span>
                      </button>
                    </>
                  )}

                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    marginTop: 'auto', padding: '12px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '6px', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-color)', border: '1px solid rgba(255, 79, 90, 0.2)',
                    background: 'white', marginBottom: '20px'
                  }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Dashboard Right Main Area */}
              <div style={{ padding: '30px', overflowY: 'auto', height: '100%', background: '#ffffff', textAlign: 'left' }}>
                
                {/* A. ADMIN MODERATION PANEL TAB */}
                {activeTab === 'admin_pending' && vendorUser.role === 'admin' && (
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px' }}>
                      Admin Moderation Console: Pending Listings ({inventoryList.length})
                    </h4>
                    
                    {inventoryList.length === 0 ? (
                      <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Great job! No pending listings require moderation currently.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {inventoryList.map((item) => (
                          <div 
                            key={item.id} 
                            style={{ border: '1px solid #fbbf24', padding: '20px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '20px', alignItems: 'center', background: '#fefcf6' }}
                          >
                            <img src={item.image} alt={item.name || item.title} style={{ width: '100px', height: '70px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div>
                              <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(251, 191, 36, 0.1)', color: '#d97706', fontWeight: 'bold', borderRadius: '4px' }}>
                                PENDING {item.type.toUpperCase()} APPROVAL
                              </span>
                              <h5 style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a1a', marginTop: '6px' }}>{item.name || item.title}</h5>
                              <p style={{ fontSize: '11px', color: 'var(--text-medium)', marginTop: '2px' }}>
                                Location: {item.city || item.destination} • Base Rate: ₹{item.price.toLocaleString('en-IN')}
                              </p>
                              <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                                Uploaded by Vendor UID: <code>{item.vendorId}</code>
                              </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <button 
                                onClick={() => handleApproveReject(item.id, item.type, 'approved')} 
                                className="btn-primary" 
                                style={{ background: '#10b981', border: 'none', padding: '6px 12px', fontSize: '11px', color: 'white', borderRadius: '4px' }}
                              >
                                Approve ✅
                              </button>
                              <button 
                                onClick={() => handleApproveReject(item.id, item.type, 'rejected')} 
                                className="btn-secondary" 
                                style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', fontSize: '11px', borderRadius: '4px' }}
                              >
                                Reject ❌
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 1. UPLOAD PROPERTY / PACKAGE TAB */}
                {activeTab === 'add_product' && vendorUser.role !== 'admin' && (
                  <div>
                    {vendorUser.role === 'hotel_owner' ? (
                      /* Hotel Owner form */
                      <form onSubmit={handleHotelUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                        <h4 style={{ fontWeight: '800', fontSize: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Register New Hotel / Stay Property</h4>
                        
                        <div className="input-group">
                          <label>Hotel Name</label>
                          <input type="text" required placeholder="e.g. Taj Holiday Village" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="input-group">
                            <label>City Location</label>
                            <input type="text" required placeholder="e.g. Goa" value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} />
                          </div>
                          <div className="input-group">
                            <label>Star Category</label>
                            <select value={hotelStars} onChange={(e) => setHotelStars(e.target.value)}>
                              <option value="5">5 Star Luxury</option>
                              <option value="4">4 Star Premium</option>
                              <option value="3">3 Star Budget</option>
                            </select>
                          </div>
                        </div>

                        <div className="input-group">
                          <label>Full Property Address</label>
                          <input type="text" required placeholder="Mobor, Cavelossim, Goa, 403731" value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="input-group">
                            <label>Base Price per Night (INR)</label>
                            <input type="number" required placeholder="e.g. 6500" value={hotelPrice} onChange={(e) => setHotelPrice(e.target.value)} />
                          </div>
                          <div className="input-group">
                            <label>Cover Photo URL (Optional)</label>
                            <input type="text" placeholder="https://images.unsplash.com/..." value={hotelImage} onChange={(e) => setHotelImage(e.target.value)} />
                          </div>
                        </div>

                        <div className="input-group">
                          <label>Hotel Description</label>
                          <textarea rows="3" placeholder="Overview of hotel services, locations, beach access details..." value={hotelDescription} onChange={(e) => setHotelDescription(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
                        </div>

                        <div className="input-group">
                          <label>Amenities list (comma-separated)</label>
                          <input type="text" value={hotelAmenities} onChange={(e) => setHotelAmenities(e.target.value)} placeholder="Free WiFi, Pool, Room Service, Private Beach..." />
                        </div>

                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Upload Stay Property</button>
                      </form>
                    ) : (
                      /* Tour Operator Form */
                      <form onSubmit={handlePackageUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
                        <h4 style={{ fontWeight: '800', fontSize: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Register New Holiday Tour Package</h4>
                        
                        <div className="input-group">
                          <label>Holiday Package Title</label>
                          <input type="text" required placeholder="e.g. Scenic Himachal & Manali Explorer" value={packageTitle} onChange={(e) => setPackageTitle(e.target.value)} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="input-group">
                            <label>Destination City/State</label>
                            <input type="text" required placeholder="e.g. Manali" value={packageDest} onChange={(e) => setPackageDest(e.target.value)} />
                          </div>
                          <div className="input-group">
                            <label>Tour Duration</label>
                            <input type="text" required placeholder="e.g. 4 Nights / 5 Days" value={packageDuration} onChange={(e) => setPackageDuration(e.target.value)} />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="input-group">
                            <label>Package Price per Person (INR)</label>
                            <input type="number" required placeholder="e.g. 14999" value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)} />
                          </div>
                          <div className="input-group">
                            <label>Cover Photo URL (Optional)</label>
                            <input type="text" placeholder="https://images.unsplash.com/..." value={packageImage} onChange={(e) => setPackageImage(e.target.value)} />
                          </div>
                        </div>

                        <div className="input-group">
                          <label>Key Highlights (comma-separated list)</label>
                          <input type="text" value={packageHighlights} onChange={(e) => setPackageHighlights(e.target.value)} placeholder="Shikara ride, Gondola cable car, River rafting..." />
                        </div>

                        <div className="input-group">
                          <label>Inclusions (comma-separated list)</label>
                          <input type="text" value={packageInclusions} onChange={(e) => setPackageInclusions(e.target.value)} placeholder="3 Star Hotel, Sightseeing Cab, Daily Meals..." />
                        </div>

                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Upload Holiday Package</button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2. INVENTORY MANAGEMENT TAB */}
                {activeTab === 'inventory' && vendorUser.role !== 'admin' && (
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px' }}>Your Listed Inventory ({inventoryList.length})</h4>
                    
                    {inventoryList.length === 0 ? (
                      <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>You haven't listed any items yet. Switch to "Upload Product" to list your hotel properties or tour packages.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {inventoryList.map((item) => (
                          <div 
                            key={item.id} 
                            style={{ border: '1px solid var(--border-light)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc' }}
                          >
                            <img src={item.image} alt={item.name || item.title} style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div style={{ flexGrow: 1 }}>
                              <h5 style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>{item.name || item.title}</h5>
                              <p style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '2px' }}>
                                Location: {item.city || item.destination} • Rate: ₹{item.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                            
                            {item.status === 'approved' && (
                              <span className="badge" style={{ background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                                Approved & Live
                              </span>
                            )}
                            {item.status === 'pending_approval' && (
                              <span className="badge" style={{ background: '#f59e0b', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                                Under Review ⚠️
                              </span>
                            )}
                            {item.status === 'rejected' && (
                              <span className="badge" style={{ background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                                Rejected ❌
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. INCOMING BOOKINGS RECORDS TAB */}
                {activeTab === 'bookings' && vendorUser.role !== 'admin' && (
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px' }}>Merchant Booking Records ({bookingsList.length})</h4>
                    
                    {bookingsList.length === 0 ? (
                      <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>No customer bookings received on your listed products yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {bookingsList.map((booking) => (
                          <div 
                            key={booking.id} 
                            style={{ border: '1px solid #10b981', padding: '16px', borderRadius: '8px', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-light)', paddingBottom: '8px', marginBottom: '8px', fontSize: '11px', color: 'var(--text-medium)' }}>
                              <span>PNR: <strong>{booking.pnr}</strong></span>
                              <span>Date: {booking.date}</span>
                            </div>
                            
                            <h5 style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a1a' }}>{booking.item?.name || booking.item?.title}</h5>
                            
                            {booking.room && (
                              <div style={{ fontSize: '12px', color: 'var(--text-medium)', marginTop: '4px' }}>
                                Selected Room: {booking.room.type}
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12px' }}>
                              <div>
                                <span style={{ color: 'var(--text-light)' }}>Customer: </span>
                                <strong>{booking.passengers[0]?.firstName} {booking.passengers[0]?.lastName}</strong> ({booking.passengers.length} guests)
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>
                                ₹{booking.totalAmount.toLocaleString('en-IN')} Paid
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

const X = ({ size, style, onClick }) => (
  <svg 
    onClick={onClick}
    style={{ ...style, cursor: 'pointer' }}
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
