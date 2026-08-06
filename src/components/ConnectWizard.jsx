import React, { useState } from 'react';
import { AMENITIES_CATEGORIES } from '../data/amenitiesData';
import { connectAddProperty } from '../data/dbService';
import { ShieldCheck, ArrowLeft, Check, Landmark, Info, Sparkles, MapPin, X, PlusCircle, HelpCircle } from 'lucide-react';

const STEP_TABS = [
  "1 Basic Info", "2 Location", "3 Amenities", "4 Rooms", "5 Photos & Videos", "6 Policies", "7 Finance & Legal"
];

const HOTEL_TYPES = [
  { 
    id: "Hotel", 
    title: "Hotel", 
    desc: "A hotel is a commercial establishment providing lodging with various amenities like dining, room service, and sometimes conference fa...", 
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "Resort", 
    title: "Resort", 
    desc: "A resort is a self-contained property offering luxurious lodging and extensive amenities, such as pools, spas, dining, and recreation...", 
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "Lodge", 
    title: "Lodge", 
    desc: "A lodge is a type of accommodation typically located in natural or remote settings, offering rustic or comfortable lodging. It serves...", 
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "Guest House", 
    title: "Guest House", 
    desc: "A guest house is a small, often privately-owned accommodation offering cozy, home-like lodging. It provides personalized service, few...", 
    img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "Palace", 
    title: "Palace", 
    desc: "A palace, when used as accommodation, is a luxurious property, often a converted royal residence, offering opulent rooms, grand archi...", 
    img: "https://images.unsplash.com/photo-1585983224974-084a8e065e76?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "Houseboat", 
    title: "Houseboat", 
    desc: "Accommodation on a floating structure that has bedrooms, a living room, a kitchen, and often a terrace or deck. Typically found in lo...", 
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    id: "Motel", 
    title: "Motel", 
    desc: "A motel is a budget-friendly accommodation typically located along highways, offering easy access and parking near guest rooms. Desig...", 
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80" 
  }
];

const HOMESTAY_TYPES = [
  { id: "Villa", title: "Villa", desc: "A spacious, independent property or entire estate for private rental, ideal for families or groups", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
  { id: "Homestay", title: "Homestay", desc: "A private residence offering rooms or the entire house for guests, where the host may or may not reside on-site.", img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80" },
  { id: "Cottage", title: "Cottage", desc: "A charming, private standalone house, typically found in leisure destinations, offering a cozy and intimate stay.", img: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80" },
  { id: "Apartment", title: "Apartment", desc: "A private flat or a group of connected rooms (e.g., 1BHK, 2BHK) within a building, usually with a kitchen or living area.", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80" },
  { id: "Apart-Hotel", title: "Apart-Hotel", desc: "Hotel-like accommodation offering apartment-style units (e.g., studio, 1-bedroom) with hotel services.", img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80" },
  { id: "Hostel", title: "Hostel", desc: "Budget-friendly accommodation with shared dormitory beds or private rooms, featuring communal spaces like kitchens and lounges.", img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80" },
  { id: "Bed and B'fast", title: "Bed and B'fast", desc: "A private home offering overnight lodging in rooms, and serving breakfast, often run by resident hosts.", img: "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=600&q=80" },
  { id: "Farmhouse", title: "Farmhouse", desc: "A large, independent property located in a rural setting, offering expansive private outdoor spaces and scenic views.", img: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=600&q=80" },
  { id: "Camp", title: "Camp", desc: "Outdoor or temporary accommodations (e.g., tents) in scenic natural locations like mountains, deserts, or beaches.", img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80" },
  { id: "Beach Hut", title: "Beach Hut", desc: "A rustic cabin or small structure, often made of wood, situated near a beach with ocean views.", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80" },
  { id: "Treehouse", title: "Treehouse", desc: "Unique accommodation built among trees, with the main living area elevated above ground level, typically made of natural materials.", img: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=600&q=80" },
  { id: "Dharamshala", title: "Dharamshala", desc: "A charitable rest-house or lodging primarily for pilgrims, offering simple and affordable accommodation.", img: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80" },
  { id: "Ashram", title: "Ashram", desc: "A spiritual retreat or sanctuary offering simple lodging for individuals seeking meditation, yoga, or religious activities.", img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80" },
  { id: "Holiday Home", title: "Holiday Home", desc: "An independent house or bungalow available for short-term rental by guests, perfect for leisure vacations.", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80" },
  { id: "RV(Recreational Vehicle)", title: "RV(Recreational Vehicle)", desc: "A recreational vehicle (e.g., caravan, campervan) available for stay, equipped with basic living amenities.", img: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80" },
  { id: "Luxury Camps", title: "Luxury Camps", desc: "High-end outdoor accommodations, often featuring large, well-appointed tents with premium amenities (e.g., comfortable beds, private ...)", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80" }
];

// Room Amenities data as specified in user request
const ROOM_AMENITIES_CATEGORIES = [
  { id: "mandatory", label: "Mandatory", count: 16 },
  { id: "popular", label: "Popular with Guests", count: 9 },
  { id: "bathroom", label: "Bathroom", count: 18 },
  { id: "features", label: "Room Features", count: 24 },
  { id: "media", label: "Media and Entertainment", count: 3 },
  { id: "food", label: "Food and Drinks", count: 7 },
  { id: "appliances", label: "Appliances", count: 15 },
  { id: "beds", label: "Beds and Blanket", count: 1 },
  { id: "safety", label: "Safety and Security", count: 1 },
  { id: "childcare", label: "Childcare", count: 1 },
  { id: "other", label: "Other Facilities", count: 6 }
];

const ROOM_AMENITIES_ITEMS = [
  "Bathtub", "Hairdryer", "Hot & Cold Water", "Toiletries", "Towels", 
  "TV", "Balcony", "Private Pool", "Air Conditioning", "Iron/Ironing Board", 
  "Mineral Water", "Kettle", "Wifi", "Safe", "Bathroom", "Peep Hole"
];

export default function ConnectWizard({ activeUser, onFinished, onCancel }) {
  const [wizardStep, setWizardStep] = useState(0); 

  // Basic Info States (Step 1)
  const [propertyType, setPropertyType] = useState('Hotel'); 
  const [subType, setSubType] = useState('Hotel');
  const [name, setName] = useState('');
  const [stars, setStars] = useState('3');
  const [yearBuilt, setYearBuilt] = useState('2020');
  const [acceptingBookingSince, setAcceptingBookingSince] = useState('2021');
  const [channelManager, setChannelManager] = useState('No');
  
  // Contact details
  const [emailId, setEmailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [useWhatsapp, setUseWhatsapp] = useState(true);
  const [landlineNumber, setLandlineNumber] = useState('');

  // Location Details States (Step 2 - Screenshot 1)
  const [locationSearch, setLocationSearch] = useState('');
  const [houseNumber, setHouseNumber] = useState('434');
  const [locality, setLocality] = useState('Indirapuram');
  const [pincode, setPincode] = useState('224010');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Ghaziabad');

  // Amenities State (Step 3 - Screenshot 2: Yes/No radio layout)
  const [amenitiesAnswers, setAmenitiesAnswers] = useState({}); 
  const [activeAmenityCategory, setActiveAmenityCategory] = useState(AMENITIES_CATEGORIES[0].id);

  // Rooms Configuration States (Step 4 - Create Room Wizard Prompt)
  const [rooms, setRooms] = useState([]);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomWizardStep, setRoomWizardStep] = useState(1); // 1: Details, 2: Occupants, 3: Bathrooms, 4: Rates, 5: Amenities, 6: Preview Summary

  // Sub-Wizard Create Room States (Exact user inputs populated for testing)
  const [roomType, setRoomType] = useState('Apartment');
  const [roomView, setRoomView] = useState('No View');
  const [numBedrooms, setNumBedrooms] = useState('1');
  const [numLivingRooms, setNumLivingRooms] = useState('1');
  const [roomInventory, setRoomInventory] = useState('1');
  const [roomSize, setRoomSize] = useState('123');
  const [roomSizeUnit, setRoomSizeUnit] = useState('Sq Ft');
  const [roomName, setRoomName] = useState('ww');
  const [roomDesc, setRoomDesc] = useState('2333bfdjagduilyAHSdcuojAKPxhgvfcDX');
  
  // Sleeping Occupancy (Room Step 2)
  const [bedArrangement1, setBedArrangement1] = useState('1 King Bed');
  const [livingArrangement1, setLivingArrangement1] = useState('1 Single Bed');
  const [extraBedsCount, setExtraBedsCount] = useState('2');
  const [maxOccupancy, setMaxOccupancy] = useState('6');

  // Bathroom (Room Step 3)
  const [bedroom1HasBathroom, setBedroom1HasBathroom] = useState(true);
  const [livingRoom1HasBathroom, setLivingRoom1HasBathroom] = useState(true);

  // Rates & Meal plans (Room Step 4)
  const [roomBaseRate, setRoomBaseRate] = useState('1123');
  const [selectedMealPlan, setSelectedMealPlan] = useState('Accommodation only');

  // Room Amenities Category tracking (Room Step 5)
  const [activeRoomAmenityCategory, setActiveRoomAmenityCategory] = useState(ROOM_AMENITIES_CATEGORIES[0].id);
  const [selectedRoomAmenities, setSelectedRoomAmenities] = useState(["TV", "Wifi", "Air Conditioning", "Safe", "Bathroom", "Toiletries", "Towels"]);

  // Cover Photo URL (Step 5)
  const [coverPhoto, setCoverPhoto] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoTags, setPhotoTags] = useState({}); // e.g. { "url1": ["Bedroom"] }
  const [activePreviewPhoto, setActivePreviewPhoto] = useState(null);
  const [isPhotoUploadSummaryActive, setIsPhotoUploadSummaryActive] = useState(false);

  // Policies (Step 6)
  const [checkInTime, setCheckInTime] = useState('12:00 PM (noon)');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM');
  const [cancelPolicy, setCancelPolicy] = useState('Free cancellation till check-in');

  // Rule Sections Answers
  const [unmarriedCouples, setUnmarriedCouples] = useState('');
  const [guestsBelow18, setGuestsBelow18] = useState('');
  const [maleOnlyGroups, setMaleOnlyGroups] = useState('');

  const [allowedIds, setAllowedIds] = useState([]);
  const [sameCityIds, setSameCityIds] = useState('');

  const [smokingAllowed, setSmokingAllowed] = useState('');
  const [wheelchairAccessible, setWheelchairAccessible] = useState('');
  const [partiesAllowed, setPartiesAllowed] = useState('');
  const [outsideVisitors, setOutsideVisitors] = useState('');

  const [petsOnProperty, setPetsOnProperty] = useState('');
  const [petsAllowed, setPetsAllowed] = useState('');

  const [twentyFourHourCheckIn, setTwentyFourHourCheckIn] = useState('');

  const [infantFree, setInfantFree] = useState('');
  const [complimentaryInfantFood, setComplimentaryInfantFood] = useState('');

  const [extraBedInRates, setExtraBedInRates] = useState('');

  const [extraKidsBed, setExtraKidsBed] = useState('');
  const [extraAdultsBed, setExtraAdultsBed] = useState('');

  const [breakfastPrice, setBreakfastPrice] = useState('');
  const [lunchPrice, setLunchPrice] = useState('');
  const [dinnerPrice, setDinnerPrice] = useState('');

  // UI Interactive States
  const [expandedRuleSection, setExpandedRuleSection] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Finance & Legal (Step 7)
  const [panNumber, setPanNumber] = useState('CJPPJ6346G');
  const [panHolderName, setPanHolderName] = useState('RISHABH JAISWAL');
  const [gstNumber, setGstNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('765102120000355');
  const [accountHolderName, setAccountHolderName] = useState('RISHABH SO RAJENDRA JAISWAL');
  const [bankIfscCode, setBankIfscCode] = useState('UBIN0576514');
  const [bankName, setBankName] = useState('UNION BANK OF INDIA');
  
  const [ownershipType, setOwnershipType] = useState('Leased Property');
  const [leasedDocType, setLeasedDocType] = useState('Leave & License Agreement (must be valid & signed)');
  const [relationshipDocType, setRelationshipDocType] = useState('');
  
  const [uploadedLeasedDoc, setUploadedLeasedDoc] = useState(null);
  const [uploadedRelationshipDoc, setUploadedRelationshipDoc] = useState(null);

  const years = Array.from({ length: 40 }, (_, i) => String(2026 - i));

  // Amenities Answer getter
  const getSelectedCountForCategory = (categoryItems) => {
    return categoryItems.filter(item => amenitiesAnswers[item] === 'Yes').length;
  };

  const handleNext = () => {
    if (wizardStep === 0 && !propertyType) {
      alert("Please select a property type!");
      return;
    }
    if (wizardStep === 1 && (!name || !emailId || !mobileNumber)) {
      alert("Please enter Property Name, Email, and Mobile number!");
      return;
    }
    if (wizardStep === 2 && (!locality || !pincode)) {
      alert("Please enter Location Details!");
      return;
    }
    if (wizardStep === 4 && rooms.length === 0) {
      alert("Please add at least one room category to configure pricing!");
      return;
    }
    
    setWizardStep(wizardStep + 1);
  };

  const handleBack = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    } else {
      onCancel();
    }
  };

  // Add room item from sub-wizard
  const handleSaveRoom = () => {
    const newRoom = {
      id: "rm-" + Date.now(),
      type: roomType,
      view: roomView,
      size: `${roomSize} ${roomSizeUnit}`,
      name: roomName || `${roomType} (${roomView})`,
      inventory: Number(roomInventory),
      description: roomDesc,
      occupancy: { bedArrangement1, livingArrangement1, extraBedsCount, maxOccupancy },
      bathroom: { bedroom1HasBathroom, livingRoom1HasBathroom },
      price: Number(roomBaseRate),
      mealPlan: selectedMealPlan,
      amenities: selectedRoomAmenities
    };

    setRooms([...rooms, newRoom]);
    setIsRoomModalOpen(false);
    setRoomWizardStep(1);
  };

  const handleToggleRoomAmenity = (am) => {
    if (selectedRoomAmenities.includes(am)) {
      setSelectedRoomAmenities(selectedRoomAmenities.filter(x => x !== am));
    } else {
      setSelectedRoomAmenities([...selectedRoomAmenities, am]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNumber || !bankName) {
      alert("Please enter Bank Account and Bank Name details!");
      return;
    }

    const yesAmenities = Object.keys(amenitiesAnswers).filter(k => amenitiesAnswers[k] === 'Yes');

    const newProperty = {
      propertyType,
      subType,
      name,
      stars,
      yearBuilt,
      acceptingBookingSince,
      channelManager,
      contactInfo: {
        email: emailId,
        mobile: mobileNumber,
        whatsapp: useWhatsapp,
        landline: landlineNumber
      },
      city,
      address: `${houseNumber}, ${locality}, ${city}, ${pincode}`,
      pincode,
      amenities: yesAmenities,
      rooms,
      image: coverPhoto || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      policies: { checkInTime, checkOutTime, cancelPolicy },
      finance: { panNumber, gstNumber, accountNumber, bankName }
    };

    try {
      await connectAddProperty(newProperty, activeUser.uid);
      alert("Congratulations! Your property onboarding is complete and listing is saved.");
      onFinished();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top connect navbar */}
      <header style={{ background: '#ffffff', padding: '14px 40px', borderBottom: '1px solid #e6ebf3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#ff4f5a', background: 'linear-gradient(135deg, #008cff 0%, #ff4f5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ∞ connect
            </span>
          </div>
          <span style={{ background: '#f0f3f6', padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', color: '#687b8c', textTransform: 'uppercase' }}>
            Hotel: In Progress
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e6ff', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
            {activeUser?.name ? activeUser.name.substring(0, 2).toUpperCase() : 'RJ'}
          </div>
          <div>
            Hi, <strong>{activeUser?.name || 'Rishabh Jaiswal'}</strong>
          </div>
        </div>
      </header>

      {/* Main Wizard Area */}
      <div style={{ flexGrow: 1, padding: '30px 40px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* Step progress ribbon */}
        {wizardStep > 0 && (
          <div style={{ display: 'flex', background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '6px', marginBottom: '24px', justifyContent: 'space-between', overflowX: 'auto' }}>
            {STEP_TABS.map((tab, idx) => {
              const currentStepIndex = wizardStep - 1;
              const isActive = currentStepIndex === idx;
              const isPassed = currentStepIndex > idx;
              return (
                <div 
                  key={idx} 
                  style={{
                    padding: '8px 16px', fontSize: '12px', fontWeight: '700', borderRadius: '6px', whiteSpace: 'nowrap',
                    color: isActive ? 'white' : isPassed ? '#10b981' : '#64748b',
                    background: isActive ? '#ff4f5a' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  {isPassed && <span style={{ color: '#10b981' }}>✓</span>}
                  {tab}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e6ebf3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '40px', textAlign: 'left' }}>
          
          {/* STEP 0: PROPERTY TYPE SELECTION */}
          {wizardStep === 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '24px', color: '#1a1a1a', marginBottom: '8px' }}>
                Which property type would you like to list?
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '30px' }}>Please select your property type from below options to get started</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                 <div 
                  onClick={() => { setPropertyType('Hotel'); setSubType('Hotel'); }}
                  style={{
                    border: '2px solid' + (propertyType === 'Hotel' ? ' #ff4f5a' : ' #e2e8f0'),
                    background: propertyType === 'Hotel' ? 'rgba(255, 79, 90, 0.02)' : 'white',
                    padding: '24px', borderRadius: '12px', cursor: 'pointer', position: 'relative', display: 'flex', gap: '16px', alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '36px' }}>🏨</span>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a1a' }}>Hotel</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                      Accommodations with facilities like dining venues, meeting rooms & more
                    </p>
                  </div>
                  {propertyType === 'Hotel' && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#ff4f5a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</div>
                  )}
                </div>

                <div 
                  onClick={() => { setPropertyType('Homestay'); setSubType('Villa'); }}
                  style={{
                    border: '2px solid' + (propertyType === 'Homestay' ? ' #ff4f5a' : ' #e2e8f0'),
                    background: propertyType === 'Homestay' ? 'rgba(255, 79, 90, 0.02)' : 'white',
                    padding: '24px', borderRadius: '12px', cursor: 'pointer', position: 'relative', display: 'flex', gap: '16px', alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '36px' }}>🏡</span>
                  <div>
                    <h4 style={{ fontWeight: '800', fontSize: '16px', color: '#1a1a1a' }}>Homestays & Villas</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                      Large independent homes / bungalows for guests that can be rented entirely or by room
                    </p>
                  </div>
                  {propertyType === 'Homestay' && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#ff4f5a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</div>
                  )}
                </div>
              </div>

              {propertyType === 'Hotel' && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>
                  <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a1a', marginBottom: '16px' }}>Type of Hotel</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {HOTEL_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSubType(type.id)}
                        style={{
                          border: '1px solid' + (subType === type.id ? ' #008cff' : ' #e2e8f0'),
                          background: '#ffffff',
                          borderRadius: '8px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          textAlign: 'left',
                          boxShadow: subType === type.id ? '0 4px 10px rgba(0,140,255,0.06)' : '0 2px 4px rgba(0,0,0,0.01)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h5 style={{ fontWeight: '750', fontSize: '13px', color: '#1a1a1a', margin: 0 }}>{type.title}</h5>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '2px solid' + (subType === type.id ? ' #008cff' : '#cbd5e1'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: subType === type.id ? '#008cff' : 'transparent'
                          }}>
                            {subType === type.id && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                            )}
                          </div>
                        </div>
                        
                        <img 
                          src={type.img} 
                          alt={type.title} 
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        
                        <p style={{
                          fontSize: '11px',
                          color: '#64748b',
                          lineHeight: 1.4,
                          margin: 0,
                          height: '52px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {type.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {propertyType === 'Homestay' && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '30px' }}>
                  <h3 style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a1a', marginBottom: '16px' }}>Type of Homestays & Villas</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {HOMESTAY_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSubType(type.id)}
                        style={{
                          border: '1px solid' + (subType === type.id ? ' #008cff' : ' #e2e8f0'),
                          background: '#ffffff',
                          borderRadius: '8px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          textAlign: 'left',
                          boxShadow: subType === type.id ? '0 4px 10px rgba(0,140,255,0.06)' : '0 2px 4px rgba(0,0,0,0.01)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h5 style={{ fontWeight: '750', fontSize: '13px', color: '#1a1a1a', margin: 0 }}>{type.title}</h5>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '2px solid' + (subType === type.id ? ' #008cff' : '#cbd5e1'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: subType === type.id ? '#008cff' : 'transparent'
                          }}>
                            {subType === type.id && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                            )}
                          </div>
                        </div>
                        
                        <img 
                          src={type.img} 
                          alt={type.title} 
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        
                        <p style={{
                          fontSize: '11px',
                          color: '#64748b',
                          lineHeight: 1.4,
                          margin: 0,
                          height: '52px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {type.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Cancel</button>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}>List Property</button>
              </div>
            </div>
          )}

          {/* STEP 1: BASIC INFO & CONTACT DETAILS */}
          {wizardStep === 1 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                Basic Info
              </h3>
              
              <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="input-group">
                  <label style={{ fontWeight: '700', color: '#1a1a1a' }}>Name of the Property</label>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '-4px' }}>Enter the name as on the property documents</p>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter the full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label style={{ fontWeight: '700', color: '#1a1a1a' }}>Hotel Star Rating</label>
                    <select value={stars} onChange={(e) => setStars(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px' }}>
                      <option value="5">5 Star Rating</option>
                      <option value="4">4 Star Rating</option>
                      <option value="3">3 Star Rating</option>
                      <option value="2">2 Star Rating</option>
                      <option value="1">1 Star Rating</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label style={{ fontWeight: '700', color: '#1a1a1a' }}>When was the property built?</label>
                    <select value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px' }}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label style={{ fontWeight: '700', color: '#1a1a1a' }}>Accepting booking since?</label>
                    <select value={acceptingBookingSince} onChange={(e) => setAcceptingBookingSince(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '12px', borderRadius: '6px' }}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>

                  <div className="input-group">
                    <label style={{ fontWeight: '700', color: '#1a1a1a' }}>Do you work with channel manager?</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <input type="radio" name="ch_mgr" checked={channelManager === 'No'} onChange={() => setChannelManager('No')} style={{ accentColor: '#ff4f5a' }} />
                        No
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <input type="radio" name="ch_mgr" checked={channelManager === 'Yes'} onChange={() => setChannelManager('Yes')} style={{ accentColor: '#ff4f5a' }} />
                        Yes
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#1a1a1a', marginBottom: '4px' }}>Contact details to be shared with guests</h4>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>These contact details will be shared with the guests when they make a booking</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="input-group">
                      <label style={{ fontSize: '12px' }}>Email ID</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="email" 
                          required 
                          placeholder="Enter email ID" 
                          value={emailId} 
                          onChange={(e) => setEmailId(e.target.value)} 
                          style={{ flexGrow: 1, border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}
                        />
                        <button type="button" onClick={() => alert("Verification link sent!")} style={{ color: 'var(--primary-color)', background: 'transparent', fontWeight: '700', fontSize: '12px' }}>Verify</button>
                      </div>
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '12px' }}>Mobile number</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', flexGrow: 1 }}>
                          <span style={{ padding: '10px', background: '#e2e8f0', fontSize: '13px', borderRight: '1px solid #cbd5e1' }}>+91</span>
                          <input 
                            type="tel" 
                            required 
                            placeholder="Enter number" 
                            value={mobileNumber} 
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g,''))} 
                            style={{ padding: '10px', width: '100%', border: 'none' }}
                          />
                        </div>
                        <button type="button" onClick={() => alert("SMS verification dispatched!")} style={{ color: 'var(--primary-color)', background: 'transparent', fontWeight: '700', fontSize: '12px' }}>Verify</button>
                      </div>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
                        <input type="checkbox" checked={useWhatsapp} onChange={(e) => setUseWhatsapp(e.target.checked)} style={{ accentColor: '#ff4f5a' }} />
                        Use the same mobile number for WhatsApp.
                      </label>
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '12px' }}>Landline number (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Eg: 0124 46373533" 
                        value={landlineNumber} 
                        onChange={(e) => setLandlineNumber(e.target.value)} 
                        style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION DETAILS */}
          {wizardStep === 2 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                Property Location Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', border: '1px solid #bfdbfe', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px', color: '#1e3a8a' }}>
                    <Info size={16} />
                    <span>Please enter the same address as on your address proof document to avoid rejections.</span>
                  </div>

                  <div className="input-group">
                    <label>Search Address</label>
                    <input 
                      type="text" 
                      placeholder="Search here" 
                      value={locationSearch} 
                      onChange={(e) => setLocationSearch(e.target.value)}
                      style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}
                    />
                    <button type="button" onClick={() => alert("Pinning location to current GPS coord...")} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#ff4f5a', fontSize: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '4px' }}>
                      Or Use My Current Location
                    </button>
                  </div>

                  <div className="input-group">
                    <label>House/Building/Apartment No.</label>
                    <input type="text" required placeholder="434" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }} />
                  </div>

                  <div className="input-group">
                    <label>Locality/Area/Street/Sector</label>
                    <input type="text" required placeholder="Indirapuram" value={locality} onChange={(e) => setLocality(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
                    <div className="input-group">
                      <label>Pincode</label>
                      <input type="text" required placeholder="224010" value={pincode} onChange={(e) => setPincode(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }} />
                    </div>
                    <div className="input-group">
                      <label>Country</label>
                      <input type="text" readOnly value={country} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', background: '#f1f5f9' }} />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>City</label>
                    <input type="text" required placeholder="e.g. Ghaziabad" value={city} onChange={(e) => setCity(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }} />
                  </div>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', height: '100%', minHeight: '350px', background: '#e2e8f0', position: 'relative' }}>
                  <iframe 
                    title="location-map"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(locality + ' ' + city)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    style={{ filter: 'grayscale(0.1) contrast(1.1)' }}
                  />
                  <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <MapPin size={12} style={{ color: '#ff4f5a' }} />
                    GPS Pin Locked
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}>Save And Continue</button>
              </div>
            </div>
          )}

          {/* STEP 3: AMENITIES YES/NO RADIO BUTTONS */}
          {wizardStep === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px' }}>Property Amenities</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Answering the amenities available at your property can significantly influence guests to book!</p>
                </div>
                <span style={{ background: '#e0f2fe', color: '#0284c7', fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px' }}>
                  Total Selected: {Object.values(amenitiesAnswers).filter(v => v === 'Yes').length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', height: '520px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', borderRight: '1px solid #cbd5e1', overflowY: 'auto' }}>
                  {AMENITIES_CATEGORIES.map((cat) => {
                    const count = getSelectedCountForCategory(cat.items);
                    const isActive = activeAmenityCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setActiveAmenityCategory(cat.id)}
                        style={{
                          padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #e2e8f0',
                          background: isActive ? '#ffffff' : 'transparent',
                          color: isActive ? '#ff4f5a' : '#334155',
                          fontWeight: isActive ? '800' : '600',
                          fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                      >
                        <span>{cat.label}</span>
                        <span style={{ fontSize: '10px', color: count > 0 ? '#10b981' : '#64748b', fontWeight: 'bold' }}>
                          ({count} of {cat.items.length})
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: '24px', overflowY: 'auto', background: '#ffffff' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '15px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px', marginBottom: '20px', color: '#1a1a1a' }}>
                    Please answer the {AMENITIES_CATEGORIES.find(c => c.id === activeAmenityCategory)?.label} Amenities available below
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {AMENITIES_CATEGORIES.find(c => c.id === activeAmenityCategory)?.items.map((item) => {
                      const answer = amenitiesAnswers[item] || 'No';
                      return (
                        <div 
                          key={item} 
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0',
                            borderBottom: '1px solid #f1f5f9'
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{item}</span>
                          
                          <div style={{ display: 'flex', gap: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name={`amenity_${item}`} 
                                checked={answer === 'No'} 
                                onChange={() => setAmenitiesAnswers({ ...amenitiesAnswers, [item]: 'No' })}
                                style={{ accentColor: '#ff4f5a' }}
                              />
                              No
                            </label>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name={`amenity_${item}`} 
                                checked={answer === 'Yes'} 
                                onChange={() => setAmenitiesAnswers({ ...amenitiesAnswers, [item]: 'Yes' })}
                                style={{ accentColor: '#ff4f5a' }}
                              />
                              Yes
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}>Save And Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4: ROOMS SELECTION */}
          {wizardStep === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px' }}>Rooms & Inventory</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Configure different categories of rooms and their per-night pricing rates</p>
                </div>
                <button 
                  onClick={() => setIsRoomModalOpen(true)}
                  className="btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#008cff', border: 'none' }}
                >
                  <PlusCircle size={16} />
                  Add Room Type
                </button>
              </div>

              {rooms.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>No room categories registered. Click "Add Room Type" to configure your inventory.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {rooms.map((rm) => (
                    <div 
                      key={rm.id} 
                      style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}
                    >
                      <div>
                        <h4 style={{ fontWeight: '800', fontSize: '15px' }}>{rm.name}</h4>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          Type: {rm.type} • View: {rm.view} • Size: {rm.size} • Bedding: {rm.occupancy.bedArrangement1} + {rm.occupancy.livingArrangement1}
                        </p>
                      </div>
                      <div style={{ textAlignment: 'right' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Base price:</span>
                        <strong style={{ fontSize: '16px', color: '#10b981' }}>₹{rm.price.toLocaleString('en-IN')}</strong> / night
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 5: PHOTOS AND VIDEOS WITH DUAL VIEW STATE */}
          {wizardStep === 5 && (
            <div>
              {!isPhotoUploadSummaryActive ? (
                /* --- STATE A: PHOTO UPLOADING & TAGGING WORKSPACE --- */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px' }}>
                        Upload Photos & Videos
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Add photos of your property and attach tags to continue</p>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        const demoPics = [
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&q=80",
                          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=500&q=80"
                        ];
                        setUploadedPhotos(demoPics);
                        setCoverPhoto(demoPics[0]);
                        setActivePreviewPhoto(demoPics[0]);
                        
                        // Seed specific tags matching Goibibo connect screenshots
                        const presetTags = {
                          [demoPics[0]]: ["Activities & Experiences"],
                          [demoPics[1]]: ["Banquet"],
                          [demoPics[2]]: ["Bar"],
                          [demoPics[3]]: ["Barbeque"],
                          [demoPics[4]]: ["Club house"],
                          [demoPics[5]]: ["Kitchen"],
                          [demoPics[6]]: ["Reception"],
                          [demoPics[7]]: ["Bar"],
                          [demoPics[8]]: ["Club house"],
                          [demoPics[9]]: ["Bedroom"]
                        };
                        setPhotoTags(presetTags);
                      }}
                      style={{ fontSize: '11px', color: 'var(--primary-color)', background: 'rgba(0,140,255,0.06)', border: '1px dashed var(--primary-color)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}
                    >
                      ⚡ Auto-upload 10 Tagged HD Photos
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
                    
                    {/* Left Area: Drag Box & Item Cards */}
                    <div>
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const mockUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80";
                          setUploadedPhotos([...uploadedPhotos, mockUrl]);
                          if (!coverPhoto) setCoverPhoto(mockUrl);
                          if (!activePreviewPhoto) setActivePreviewPhoto(mockUrl);
                        }}
                        onClick={() => {
                          const mockUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&w=500&q=80";
                          setUploadedPhotos([...uploadedPhotos, mockUrl]);
                          if (!coverPhoto) setCoverPhoto(mockUrl);
                          if (!activePreviewPhoto) setActivePreviewPhoto(mockUrl);
                        }}
                        style={{
                          border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '30px 20px', background: '#f8fafc',
                          textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '24px'
                        }}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                        <h4 style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b' }}>Drag & Drop the photos and videos</h4>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', margin: '2px 0' }}>or</span>
                        <button type="button" style={{ background: '#ff4f5a', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                          click here
                        </button>
                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '6px' }}>(Upload JPEG/PNG files up to 30 MB each)</span>
                      </div>

                      {uploadedPhotos.length === 0 ? (
                        <div style={{ background: '#f1f5f9', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                          No photos uploaded yet. Drop files or use the auto-upload helper.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
                          {uploadedPhotos.map((url, idx) => {
                            const isCover = coverPhoto === url;
                            const tags = photoTags[url] || [];
                            const isSelected = activePreviewPhoto === url;
                            
                            return (
                              <div 
                                key={idx}
                                style={{
                                  display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: '16px', padding: '12px',
                                  borderRadius: '8px', border: '1px solid' + (isSelected ? ' #ff4f5a' : ' #cbd5e1'),
                                  background: isSelected ? 'rgba(255, 79, 90, 0.01)' : 'white',
                                  alignItems: 'center'
                                }}
                              >
                                <div style={{ width: '90px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
                                  <img src={url} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  {isCover && (
                                    <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: '#ff4f5a', color: 'white', fontSize: '7px', fontWeight: 'bold', padding: '1px 3px', borderRadius: '2px' }}>COVER</span>
                                  )}
                                </div>

                                <div style={{ textAlign: 'left' }}>
                                  <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        setUploadedPhotos(uploadedPhotos.filter(x => x !== url));
                                        if (coverPhoto === url) setCoverPhoto(uploadedPhotos[0] || '');
                                        if (activePreviewPhoto === url) setActivePreviewPhoto(uploadedPhotos[0] || null);
                                        const nextTags = { ...photoTags };
                                        delete nextTags[url];
                                        setPhotoTags(nextTags);
                                      }}
                                      style={{ color: '#ef4444', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                      delete
                                    </button>
                                    
                                    <button 
                                      type="button" 
                                      onClick={() => setActivePreviewPhoto(url)}
                                      style={{ color: 'var(--primary-color)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                                    >
                                      Click To View
                                    </button>
                                  </div>

                                  <div style={{ marginTop: '8px' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>Tags: </span>
                                    {tags.length === 0 ? (
                                      <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700' }}>⚠️ No tags attached</span>
                                    ) : (
                                      tags.map(tag => (
                                        <span key={tag} style={{ background: '#e2e8f0', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginRight: '4px', fontWeight: '600' }}>{tag}</span>
                                      ))
                                    )}
                                  </div>
                                </div>

                                <button 
                                  type="button"
                                  onClick={() => setCoverPhoto(url)}
                                  style={{
                                    fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
                                    background: isCover ? '#ff4f5a' : '#f1f5f9',
                                    color: isCover ? 'white' : '#475569',
                                    border: '1px solid' + (isCover ? '#ff4f5a' : '#cbd5e1')
                                  }}
                                >
                                  {isCover ? 'Cover Active' : 'Set Cover'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Area: Preview of Media & Tags Selector */}
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                      <h4 style={{ fontWeight: '850', fontSize: '14px', color: '#1e293b', marginBottom: '14px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px' }}>
                        Preview of Media
                      </h4>

                      {activePreviewPhoto ? (
                        <div>
                          <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#e2e8f0', marginBottom: '16px' }}>
                            <img src={activePreviewPhoto} alt="Active Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>

                          <div style={{ textAlign: 'left' }}>
                            <h5 style={{ fontWeight: '800', fontSize: '12px', color: '#1e293b', marginBottom: '6px' }}>Selected Tags</h5>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                              {["Bedroom", "Bathroom", "Reception", "Exterior", "Swimming Pool", "Dining/Kitchen", "Lounge", "Activities & Experiences", "Banquet", "Bar", "Barbeque", "Club house", "Kitchen"].map((tag) => {
                                const tags = photoTags[activePreviewPhoto] || [];
                                const isTagged = tags.includes(tag);
                                return (
                                  <button
                                    type="button"
                                    key={tag}
                                    onClick={() => {
                                      let nextTags = [...tags];
                                      if (isTagged) {
                                        nextTags = nextTags.filter(t => t !== tag);
                                      } else {
                                        if (tags.length >= 2) {
                                          alert("You can add a maximum of 2 tags!");
                                          return;
                                        }
                                        nextTags.push(tag);
                                      }
                                      setPhotoTags({ ...photoTags, [activePreviewPhoto]: nextTags });
                                    }}
                                    style={{
                                      padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                                      background: isTagged ? '#ff4f5a' : '#ffffff',
                                      color: isTagged ? 'white' : '#475569',
                                      border: '1px solid' + (isTagged ? '#ff4f5a' : '#cbd5e1'),
                                      transition: 'all 0.15s'
                                    }}
                                  >
                                    {tag} {isTagged && '✓'}
                                  </button>
                                );
                              })}
                            </div>

                            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#b45309', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span>💡 <strong>You can add a maximum of 2 tags</strong></span>
                              <span>⚠️ <strong>To continue, please attach a tag to all the photos and videos</strong></span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '12px' }}>
                          Click on any uploaded item to preview it and attach category tags.
                        </div>
                      )}
                    </div>

                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                    <button 
                      onClick={() => {
                        if (uploadedPhotos.length < 10) {
                          alert("MMT guidelines require minimum 10 photos to list! Please upload at least 10 photos.");
                          return;
                        }
                        
                        const untaggedExists = uploadedPhotos.some(url => !photoTags[url] || photoTags[url].length === 0);
                        if (untaggedExists) {
                          alert("To continue, please attach a tag to all the photos and videos!");
                          return;
                        }
                        
                        setIsPhotoUploadSummaryActive(true); // Switch to State B!
                      }} 
                      className="btn-primary" 
                      style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ) : (
                /* --- STATE B: ONBOARD VERIFICATION STATUS SUMMARY SCREEN (Screenshots 1 & 2) --- */
                <div>
                  
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px' }}>
                        Photos & Videos ({uploadedPhotos.length})
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsPhotoUploadSummaryActive(false)}
                      style={{ background: '#ff4f5a', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                    >
                      Upload More
                    </button>
                  </div>

                  {/* Main Banner Graphic (Roadmap / Cover Preview) */}
                  <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
                    <img 
                      src={coverPhoto || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"} 
                      alt="Property cover" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    
                    {/* Left overlay tag */}
                    <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.65)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      Property cover photo ({photoTags[coverPhoto]?.join(', ') || 'Activities & Experiences'})
                    </div>

                    {/* Right overlay change link */}
                    <button 
                      onClick={() => setIsPhotoUploadSummaryActive(false)}
                      style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', color: '#ff4f5a', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Change
                    </button>
                  </div>

                  {/* Orange alert Banner (Review Status) */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '14px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', color: '#b45309', fontSize: '13px', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>⚠️</span>
                      <span>{uploadedPhotos.length} photos & videos are being reviewed. It will take up to 24 hrs.</span>
                    </div>
                    <button type="button" onClick={() => alert("Items review panel launched.")} style={{ color: 'var(--primary-color)', background: 'transparent', border: 'none', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
                      View Items
                    </button>
                  </div>

                  {/* Section: Assigned to Rooms */}
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontWeight: '850', fontSize: '16px', color: '#1a1a1a', marginBottom: '4px' }}>Photos & Videos assigned to the rooms & restaurant(s)</h4>
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Photos help customers visualize what the room looks like</p>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', background: 'white', width: '150px' }}>
                        <div style={{ width: '100%', height: '80px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                          <img 
                            src={uploadedPhotos.find(url => photoTags[url]?.includes('Bedroom')) || coverPhoto} 
                            alt="Room assigned thumbnail" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#1a1a1a' }}>{rooms[0]?.name || 'ww'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Tagged Categories Grids (Screenshot 1 bottom row) */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontWeight: '850', fontSize: '16px', color: '#1a1a1a', marginBottom: '16px' }}>Photos & Videos tagged</h4>
                    
                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
                      {Object.entries(
                        // Dynamic groupings helper
                        uploadedPhotos.reduce((acc, url) => {
                          const tags = photoTags[url] || [];
                          tags.forEach(tag => {
                            if (!acc[tag]) acc[tag] = [];
                            acc[tag].push(url);
                          });
                          return acc;
                        }, {})
                      ).map(([tagName, picsList]) => (
                        <div key={tagName} style={{ width: '110px', textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: '100%', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: '8px' }}>
                            <img src={picsList[0]} alt={tagName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {/* Card count badge for multiples */}
                            {picsList.length > 0 && (
                              <div style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.65)', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                🗂️ {picsList.length}
                              </div>
                            )}
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#334155', display: 'block', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{tagName}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Actions footer */}
                  <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => setIsPhotoUploadSummaryActive(false)} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                    <button 
                      onClick={handleNext} 
                      className="btn-primary" 
                      style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}
                    >
                      Save And Continue
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* STEP 6: POLICIES */}
          {wizardStep === 6 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Left Side: Policies & Rules Forms */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', color: '#1a1a1a', marginBottom: '4px' }}>
                    Policies
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Mention all the policies applicable at your property.</p>

                  {/* 1. Check-in & Check-out Time */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '16px' }}>Check-in & Check-out Time</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '-12px', marginBottom: '20px' }}>Specify the check-in & check-out time at your property</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>Check-in Time</label>
                        <select value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}>
                          <option value="12:00 PM (noon)">12:00 PM (noon)</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label style={{ fontSize: '12px', fontWeight: '700' }}>Check-out Time</label>
                        <select value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px' }}>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM (noon)">12:00 PM (noon)</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Cancellation Policy */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>Cancellation Policy</h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>Offering a flexible cancellation policy helps traveller book in advance.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer', border: '1px solid' + (cancelPolicy === 'Free cancellation till check-in' ? ' #ff4f5a' : '#e2e8f0'), padding: '14px', borderRadius: '8px', background: cancelPolicy === 'Free cancellation till check-in' ? 'rgba(255,79,90,0.01)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input type="radio" name="cancel_pol" checked={cancelPolicy === 'Free cancellation till check-in'} onChange={() => setCancelPolicy('Free cancellation till check-in')} style={{ accentColor: '#ff4f5a' }} />
                          <span style={{ fontSize: '13px', fontWeight: '700' }}>Free Cancellation till check-in <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>RECOMMENDED</span></span>
                        </div>
                        {cancelPolicy === 'Free cancellation till check-in' && (
                          <div style={{ marginTop: '10px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>
                              <span>Booking Date</span>
                              <span style={{ color: '#16a34a', fontWeight: '800' }}>100% Refund</span>
                              <span>Check-in</span>
                            </div>
                            <div style={{ height: '6px', background: 'linear-gradient(90deg, #ff4f5a 0%, #10b981 100%)', borderRadius: '3px' }}></div>
                          </div>
                        )}
                      </label>

                      {['Free Cancellation till 24 hours before check-in', 'Free Cancellation till 48 hours before check-in', 'Free Cancellation till 72 hours before check-in', 'Non-Refundable'].map((pol) => (
                        <label key={pol} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid' + (cancelPolicy === pol ? ' #ff4f5a' : '#e2e8f0'), padding: '14px', borderRadius: '8px', background: cancelPolicy === pol ? 'rgba(255,79,90,0.01)' : 'transparent', fontSize: '13px', fontWeight: '700' }}>
                          <input type="radio" name="cancel_pol" checked={cancelPolicy === pol} onChange={() => setCancelPolicy(pol)} style={{ accentColor: '#ff4f5a' }} />
                          {pol}
                        </label>
                      ))}
                    </div>

                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '6px', fontSize: '11px', color: '#1e3a8a', marginTop: '16px', display: 'flex', gap: '6px' }}>
                      <span>ℹ️</span>
                      <span>Selected policy would be applicable to 1 rateplan created. You can modify this policy after completing the listing.</span>
                    </div>
                  </div>

                  {/* 3. Property Rules (Accordions) */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>Property Rules <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>(optional)</span></h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>Add property rules basis the requirement of your property listing</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      
                      {/* Accordion 1: Guest Profile */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'guest' ? null : 'guest')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Guest Profile</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {[unmarriedCouples, guestsBelow18, maleOnlyGroups].filter(Boolean).length}/3 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'guest' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you allow unmarried couples?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="unmarried" checked={unmarriedCouples === 'Yes'} onChange={() => setUnmarriedCouples('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="unmarried" checked={unmarriedCouples === 'No'} onChange={() => setUnmarriedCouples('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you allow guests below 18 years of age at your property?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="below18" checked={guestsBelow18 === 'Yes'} onChange={() => setGuestsBelow18('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="below18" checked={guestsBelow18 === 'No'} onChange={() => setGuestsBelow18('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Groups with only male guests are allowed at your property?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="males_only" checked={maleOnlyGroups === 'Yes'} onChange={() => setMaleOnlyGroups('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="males_only" checked={maleOnlyGroups === 'No'} onChange={() => setMaleOnlyGroups('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 2: Acceptable Identity Proofs */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'id_proofs' ? null : 'id_proofs')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Acceptable Identity Proofs</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {(allowedIds.length > 0 ? 1 : 0) + (sameCityIds !== '' ? 1 : 0)}/2 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'id_proofs' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Acceptable Identity Proofs</label>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                                {["Aadhaar Card", "Passport", "Driving License", "Voter ID"].map(idType => {
                                  const isChecked = allowedIds.includes(idType);
                                  return (
                                    <label key={idType} style={{ fontSize: '12px', display: 'flex', gap: '6px', cursor: 'pointer' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={isChecked} 
                                        onChange={() => {
                                          if (isChecked) {
                                            setAllowedIds(allowedIds.filter(x => x !== idType));
                                          } else {
                                            setAllowedIds([...allowedIds, idType]);
                                          }
                                        }}
                                        style={{ accentColor: '#ff4f5a' }}
                                      />
                                      {idType}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Are IDs of the same city at the property allowed?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="same_city" checked={sameCityIds === 'Yes'} onChange={() => setSameCityIds('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="same_city" checked={sameCityIds === 'No'} onChange={() => setSameCityIds('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 3: Property Restrictions */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'restrictions' ? null : 'restrictions')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Property Restrictions</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {[smokingAllowed, wheelchairAccessible, partiesAllowed, outsideVisitors].filter(Boolean).length}/4 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'restrictions' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Is smoking allowed anywhere within the premises?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="smoke" checked={smokingAllowed === 'Yes'} onChange={() => setSmokingAllowed('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="smoke" checked={smokingAllowed === 'No'} onChange={() => setSmokingAllowed('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>

                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Is your property accessible for guests who use a wheelchair?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="wheel" checked={wheelchairAccessible === 'Yes'} onChange={() => setWheelchairAccessible('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="wheel" checked={wheelchairAccessible === 'No'} onChange={() => setWheelchairAccessible('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>

                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Are Private parties or events allowed at the property?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="parties" checked={partiesAllowed === 'Yes'} onChange={() => setPartiesAllowed('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="parties" checked={partiesAllowed === 'No'} onChange={() => setPartiesAllowed('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>

                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Can guests invite any outside visitors in the room during their stay?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="visitors" checked={outsideVisitors === 'Yes'} onChange={() => setOutsideVisitors('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="visitors" checked={outsideVisitors === 'No'} onChange={() => setOutsideVisitors('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 4: Pet Policy */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'pets' ? null : 'pets')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Pet Policy</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {[petsOnProperty, petsAllowed].filter(Boolean).length}/2 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'pets' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Any Pet(s) living on the property?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="pets_on" checked={petsOnProperty === 'Yes'} onChange={() => setPetsOnProperty('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="pets_on" checked={petsOnProperty === 'No'} onChange={() => setPetsOnProperty('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Are Pets Allowed?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="pets_allow" checked={petsAllowed === 'Yes'} onChange={() => setPetsAllowed('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="pets_allow" checked={petsAllowed === 'No'} onChange={() => setPetsAllowed('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 5: Checkin and Checkout Policies */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'checkin_policies' ? null : 'checkin_policies')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Checkin and Checkout Policies</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {twentyFourHourCheckIn !== '' ? 1 : 0}/1 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'checkin_policies' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you have a 24-hour check-in?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="hr24" checked={twentyFourHourCheckIn === 'Yes'} onChange={() => setTwentyFourHourCheckIn('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="hr24" checked={twentyFourHourCheckIn === 'No'} onChange={() => setTwentyFourHourCheckIn('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 6: Infant Policy */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'infants' ? null : 'infants')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Infant Policy</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {[infantFree, complimentaryInfantFood].filter(Boolean).length}/2 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'infants' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you want to include 1 infant (0-2 yrs) per room without counting them in total room occupancy?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="infant_free" checked={infantFree === 'Yes'} onChange={() => setInfantFree('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="infant_free" checked={infantFree === 'No'} onChange={() => setInfantFree('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>

                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you provide complimentary food item(s) like warm milk for infants (0-2 yrs) on request?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="infant_food" checked={complimentaryInfantFood === 'Yes'} onChange={() => setComplimentaryInfantFood('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="infant_food" checked={complimentaryInfantFood === 'No'} onChange={() => setComplimentaryInfantFood('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 7: Extra Bed Inclusion Policy */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'extra_inclusion' ? null : 'extra_inclusion')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Extra Bed Inclusion Policy</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {extraBedInRates !== '' ? 1 : 0}/1 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'extra_inclusion' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Is extra bed/mattress included in extra adult/paid child rates?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="eb_inc" checked={extraBedInRates === 'Yes'} onChange={() => setExtraBedInRates('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="eb_inc" checked={extraBedInRates === 'No'} onChange={() => setExtraBedInRates('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 8: Extra Bed Policies */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'extra_beds' ? null : 'extra_beds')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Extra Bed Policies</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {[extraKidsBed, extraAdultsBed].filter(Boolean).length}/2 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'extra_beds' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you provide bed to extra kids?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="kids_eb" checked={extraKidsBed === 'Yes'} onChange={() => setExtraKidsBed('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="kids_eb" checked={extraKidsBed === 'No'} onChange={() => setExtraKidsBed('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>

                            <div className="input-group">
                              <label style={{ fontSize: '12px' }}>Do you provide bed to extra adults?</label>
                              <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="adults_eb" checked={extraAdultsBed === 'Yes'} onChange={() => setExtraAdultsBed('Yes')} style={{ accentColor: '#ff4f5a' }} /> Yes</label>
                                <label style={{ fontSize: '12px', display: 'flex', gap: '4px' }}><input type="radio" name="adults_eb" checked={extraAdultsBed === 'No'} onChange={() => setExtraAdultsBed('No')} style={{ accentColor: '#ff4f5a' }} /> No</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Accordion 9: Meal rack prices */}
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <div 
                          onClick={() => setExpandedRuleSection(expandedRuleSection === 'meal_prices' ? null : 'meal_prices')}
                          style={{ background: '#f8fafc', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>Meal rack prices</span>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                            {[breakfastPrice, lunchPrice, dinnerPrice].filter(Boolean).length}/3 RULES ADDED
                          </span>
                        </div>
                        {expandedRuleSection === 'meal_prices' && (
                          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                              <div className="input-group">
                                <label style={{ fontSize: '12px' }}>Breakfast</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                                  <span style={{ padding: '8px', background: '#f1f5f9', fontSize: '12px', fontWeight: 'bold' }}>₹</span>
                                  <input type="number" placeholder="Price" value={breakfastPrice} onChange={(e) => setBreakfastPrice(e.target.value)} style={{ padding: '8px', border: 'none', width: '100%', fontSize: '12px' }} />
                                </div>
                              </div>
                              <div className="input-group">
                                <label style={{ fontSize: '12px' }}>Lunch</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                                  <span style={{ padding: '8px', background: '#f1f5f9', fontSize: '12px', fontWeight: 'bold' }}>₹</span>
                                  <input type="number" placeholder="Price" value={lunchPrice} onChange={(e) => setLunchPrice(e.target.value)} style={{ padding: '8px', border: 'none', width: '100%', fontSize: '12px' }} />
                                </div>
                              </div>
                              <div className="input-group">
                                <label style={{ fontSize: '12px' }}>Dinner</label>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                                  <span style={{ padding: '8px', background: '#f1f5f9', fontSize: '12px', fontWeight: 'bold' }}>₹</span>
                                  <input type="number" placeholder="Price" value={dinnerPrice} onChange={(e) => setDinnerPrice(e.target.value)} style={{ padding: '8px', border: 'none', width: '100%', fontSize: '12px' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

                {/* Right Side: Step Details & FAQS Panel */}
                <div>
                  
                  {/* Step Detail Card */}
                  <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(2,132,199,0.15)', marginBottom: '24px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '24px', opacity: 0.25 }}>⭐️</div>
                    <h4 style={{ fontWeight: '850', fontSize: '16px', marginBottom: '10px' }}>Step Detail</h4>
                    <p style={{ fontSize: '11px', lineHeight: '1.5', opacity: 0.9 }}>
                      Add details on check-in/check-out timings, cancellation policies, rules & restrictions applicable to your property. It will set the right expectations for the guests looking forward to booking your property.
                    </p>
                  </div>

                  {/* FAQ list */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px', marginBottom: '16px' }}>
                      <h4 style={{ fontWeight: '850', fontSize: '13px', color: '#1a1a1a' }}>Frequently Asked Questions</h4>
                      <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Hide</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      
                      {/* Q1 */}
                      <div>
                        <div 
                          onClick={() => setExpandedFaq(expandedFaq === 'faq1' ? null : 'faq1')}
                          style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span>Apart from the policies mentioned, can I add a customised policy?</span>
                          <span>{expandedFaq === 'faq1' ? '▲' : '▼'}</span>
                        </div>
                        {expandedFaq === 'faq1' && (
                          <p style={{ fontSize: '10px', color: '#475569', marginTop: '6px', lineHeight: 1.4, background: '#f8fafc', padding: '10px', borderRadius: '4px' }}>
                            Yes, you can get a customised policy added for your property by contacting your BDM (Business Development Manager).
                          </p>
                        )}
                      </div>

                      {/* Q2 */}
                      <div>
                        <div 
                          onClick={() => setExpandedFaq(expandedFaq === 'faq2' ? null : 'faq2')}
                          style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span>What should I do if I face any dispute, or if a guest violates rules?</span>
                          <span>{expandedFaq === 'faq2' ? '▲' : '▼'}</span>
                        </div>
                        {expandedFaq === 'faq2' && (
                          <p style={{ fontSize: '10px', color: '#475569', marginTop: '6px', lineHeight: 1.4, background: '#f8fafc', padding: '10px', borderRadius: '4px' }}>
                            Please contact our 24/7 partner support line or report via the partner console dashboard help center.
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

              </div>

              {/* Step 6 Footer controls */}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#ff4f5a', border: 'none' }}>Save And Continue</button>
              </div>
            </div>
          )}

          {/* STEP 7: FINANCE & LEGAL */}
          {wizardStep === 7 && (
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!accountNumber || !bankName || !bankIfscCode || !accountHolderName) {
                alert("Please complete all Bank Account Information details!");
                return;
              }
              if (!panNumber) {
                alert("Please provide your PAN Number!");
                return;
              }
              if (!uploadedLeasedDoc) {
                alert("Please upload the required Leased Property Document (Leave & License Agreement)!");
                return;
              }
              if (!uploadedRelationshipDoc) {
                alert("Please upload the Address cum Relationship Proof Document!");
                return;
              }
              handleSubmit(e);
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '24px' }}>
                Finance & Legal
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start', textAlign: 'left' }}>
                
                {/* Left Side: Financial Forms & Uploaders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Section 1: Bank Account Details */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
                    <h4 style={{ fontWeight: '850', fontSize: '15px', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🏦 Bank Account Information
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>Bank Account Number</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Enter account number" 
                          value={accountNumber} 
                          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g,''))} 
                          style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '13px' }} 
                        />
                      </div>
                      
                      <div className="input-group">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>Account Holder Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="As per bank records" 
                          value={accountHolderName} 
                          onChange={(e) => setAccountHolderName(e.target.value)} 
                          style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '13px' }} 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>Bank IFSC Code</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. UBIN0576514" 
                          value={bankIfscCode} 
                          onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())} 
                          style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '13px' }} 
                        />
                      </div>

                      <div className="input-group">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>Bank Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. UNION BANK OF INDIA" 
                          value={bankName} 
                          onChange={(e) => setBankName(e.target.value)} 
                          style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '13px' }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Tax and MSME Information */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
                    <h4 style={{ fontWeight: '850', fontSize: '15px', color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📝 Tax and MSME Information
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>PAN Number</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="CJPPJ6346G" 
                          value={panNumber} 
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())} 
                          style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '13px' }} 
                        />
                      </div>

                      <div className="input-group">
                        <label style={{ fontSize: '11px', fontWeight: '700' }}>PAN Holder Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. RISHABH JAISWAL" 
                          value={panHolderName} 
                          onChange={(e) => setPanHolderName(e.target.value)} 
                          style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontSize: '13px' }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Property Documents */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '24px' }}>
                    <h4 style={{ fontWeight: '850', fontSize: '15px', color: '#1a1a1a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📁 Property Documents
                    </h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>Provide necessary documents for verification and onboarding completion</p>
                    
                    {/* Ownership Toggles */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '8px' }}>Select Business Ownership Type</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div 
                          onClick={() => setOwnershipType('Owned')}
                          style={{ border: '1px solid' + (ownershipType === 'Owned' ? ' #ff4f5a' : ' #cbd5e1'), borderRadius: '6px', padding: '10px', cursor: 'pointer', background: ownershipType === 'Owned' ? 'rgba(255,79,90,0.02)' : 'white' }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: '700' }}>Owned Property</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Individual ownership</div>
                        </div>

                        <div 
                          onClick={() => setOwnershipType('Leased Property')}
                          style={{ border: '1px solid' + (ownershipType === 'Leased Property' ? ' #ff4f5a' : ' #cbd5e1'), borderRadius: '6px', padding: '10px', cursor: 'pointer', background: ownershipType === 'Leased Property' ? 'rgba(255,79,90,0.02)' : 'white' }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: '700' }}>Leased Property</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Rented/leased premises</div>
                        </div>

                        <div 
                          onClick={() => setOwnershipType('Managed')}
                          style={{ border: '1px solid' + (ownershipType === 'Managed' ? ' #ff4f5a' : ' #cbd5e1'), borderRadius: '6px', padding: '10px', cursor: 'pointer', background: ownershipType === 'Managed' ? 'rgba(255,79,90,0.02)' : 'white' }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: '700' }}>Managed Property</div>
                          <div style={{ fontSize: '9px', color: '#64748b' }}>Third party managed premises</div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Checker box */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b', fontWeight: '700' }}>Name on PAN:</span>
                        <span style={{ color: '#1e293b', fontWeight: '800' }}>{panHolderName}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: '#64748b', fontWeight: '700' }}>Property Address on Location Step:</span>
                        <span style={{ color: '#1e293b', fontWeight: '800', lineHeight: 1.4 }}>
                          {houseNumber || '434'}, {locality || 'Indirapuram'}, {city || 'Ghaziabad'}, Uttar Pradesh, India, Pincode - {pincode || '224010'}
                        </span>
                      </div>
                    </div>

                    {/* Document Selector & Upload Grid */}
                    {ownershipType === 'Leased Property' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* File 1: Leased Property Document */}
                        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>Select Leased Property Document Type to Upload</label>
                          <select 
                            value={leasedDocType} 
                            onChange={(e) => setLeasedDocType(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', marginTop: '6px', marginBottom: '10px' }}
                          >
                            <option value="Leave & License Agreement (must be valid & signed)">Leave & License Agreement (must be valid & signed)</option>
                            <option value="Registered Lease Deed">Registered Lease Deed</option>
                            <option value="Rent Agreement (Notarised)">Rent Agreement (Notarised)</option>
                          </select>

                          <div 
                            onClick={() => setUploadedLeasedDoc("Leave_License_Agreement_Signed.pdf")}
                            style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '18px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}
                          >
                            {uploadedLeasedDoc ? (
                              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 'bold' }}>
                                ✓ Attached: {uploadedLeasedDoc} (Click to replace)
                              </div>
                            ) : (
                              <div>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b', display: 'block' }}>Click to upload or drag and drop here</span>
                                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>JPG, PNG or PDF (max. 5 MB)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* File 2: Address cum Relationship Proof */}
                        <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>Select Address cum Relationship Proof Document Type to Upload</label>
                          <select 
                            value={relationshipDocType} 
                            onChange={(e) => setRelationshipDocType(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', marginTop: '6px', marginBottom: '10px' }}
                          >
                            <option value="">Select Document Type</option>
                            <option value="Electricity Bill">Electricity Bill</option>
                            <option value="LPG Connection Bill">LPG Connection Bill</option>
                            <option value="Telephone Bill">Telephone Bill</option>
                            <option value="Voter ID Card">Voter ID Card</option>
                            <option value="NOC from Property Owner">NOC from Property Owner</option>
                          </select>

                          <div 
                            onClick={() => {
                              if (!relationshipDocType) {
                                alert("Please select a document type first!");
                                return;
                              }
                              setUploadedRelationshipDoc(`Relationship_Proof_${relationshipDocType.replace(/\s+/g,'_')}.pdf`);
                            }}
                            style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '18px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}
                          >
                            {uploadedRelationshipDoc ? (
                              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 'bold' }}>
                                ✓ Attached: {uploadedRelationshipDoc} (Click to replace)
                              </div>
                            ) : (
                              <div>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b', display: 'block' }}>Click to upload or drag and drop here</span>
                                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>JPG, PNG or PDF (max. 5 MB)</span>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>

                {/* Right Side: IMPORTANT Alert Box Instructions */}
                <div>
                  
                  {/* Alert banner box */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '24px', color: '#b45309' }}>
                    <h4 style={{ fontWeight: '850', fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ⚠️ IMPORTANT
                    </h4>
                    
                    <p style={{ fontSize: '11px', lineHeight: '1.5', marginBottom: '14px' }}>
                      To complete your hotel onboarding, please upload the required documents mentioned below. These documents help us verify the ownership and legal association of the property.
                    </p>

                    <h5 style={{ fontWeight: '800', fontSize: '11px', margin: '10px 0 6px 0', textTransform: 'uppercase' }}>Required Documents:</h5>
                    <ul style={{ fontSize: '11px', paddingLeft: '16px', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                      <li>Property Registration document, Lease Deed/Agreement, or Management Agreement.</li>
                      <li>Address proof or relationship proof linking you with the property owner (mandatory even if you are the owner).</li>
                    </ul>

                    <h5 style={{ fontWeight: '800', fontSize: '11px', margin: '10px 0 6px 0', textTransform: 'uppercase' }}>Before Uploading, Please Ensure:</h5>
                    <ul style={{ fontSize: '11px', paddingLeft: '16px', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                      <li>The name and address on the documents match your PAN and bank account details.</li>
                      <li>
                        If the uploaded documents have a different name/address than the PAN or property address shared during onboarding, you can upload a notarised affidavit in the next step.{" "}
                        <button type="button" onClick={() => alert("Affidavit template template loaded successfully.")} style={{ color: 'var(--primary-color)', background: 'transparent', border: 'none', padding: 0, fontSize: '11px', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer' }}>
                          View sample affidavit.
                        </button>
                      </li>
                    </ul>

                    <p style={{ fontSize: '11px', fontWeight: '700', fontStyle: 'italic', borderTop: '1px dashed #fcd34d', paddingTop: '10px', marginTop: '10px' }}>
                      Providing correct documents will help in faster verification and smooth onboarding of your property.
                    </p>
                  </div>

                </div>

              </div>

              {/* Step Footer Actions */}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={handleBack} className="btn-secondary" style={{ padding: '10px 24px', fontSize: '13px' }}>Back</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 30px', fontSize: '13px', background: '#10b981', border: 'none', color: 'white', fontWeight: 'bold' }}>Onboard Property ✅</button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* --- CREATE ROOM MULTI-STEP SUB-WIZARD MODAL (Goibibo Wizard Prompt specs) --- */}
      {isRoomModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-in" style={{ width: '90%', maxWidth: '680px', height: '85vh', gridTemplateRows: 'auto 1fr auto' }}>
            
            {/* Modal Header */}
            <div className="modal-header" style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', padding: '16px 24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '850', color: '#1e293b' }}>Create Room</h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Step-by-step room onboarding configuration wizard</span>
              </div>
              <button onClick={() => { setIsRoomModalOpen(false); setRoomWizardStep(1); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Ribbon progress bar */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '10px 24px', gap: '12px', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', justifyContent: 'space-between' }}>
              {[
                "1 Room Details", 
                "2 Sleeping Occupancy", 
                "3 Bathroom Details", 
                "4 Meal Plan & Rates", 
                "5 Amenity Details"
              ].map((rmTab, idx) => {
                const stepNum = idx + 1;
                const isActive = roomWizardStep === stepNum || (roomWizardStep === 6 && stepNum === 5);
                const isPassed = roomWizardStep > stepNum;
                return (
                  <div 
                    key={idx} 
                    style={{
                      fontSize: '11px', fontWeight: '800', padding: '6px 12px', borderRadius: '4px',
                      background: isActive ? '#ff4f5a' : 'transparent',
                      color: isActive ? 'white' : isPassed ? '#10b981' : '#64748b',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    {isPassed && <span>✓</span>}
                    {rmTab}
                  </div>
                );
              })}
            </div>

            {/* Modal Body Scroll */}
            <div style={{ padding: '24px', overflowY: 'auto', textAlign: 'left' }}>
              
              {/* SUB-STEP 1: ROOM DETAILS */}
              {roomWizardStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Room Details</h4>
                  
                  <div className="input-group">
                    <label style={{ fontWeight: '700' }}>Room Name (as displayed on MakeMyTrip & partner websites)</label>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '-4px' }}>Add a room name that looks attractive to travellers</p>
                    <input 
                      type="text" 
                      placeholder="e.g. ww" 
                      value={roomName} 
                      onChange={(e) => setRoomName(e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="input-group">
                      <label>Room type</label>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '-4px' }}>Choose the type that best describes this room</p>
                      <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                        <option value="Apartment">Apartment</option>
                        <option value="Standard Room">Standard Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Villa">Villa</option>
                        <option value="Deluxe Room">Deluxe Room</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Room view</label>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '-4px' }}>Describe what the guest will see from this room</p>
                      <select value={roomView} onChange={(e) => setRoomView(e.target.value)}>
                        <option value="No View">No View</option>
                        <option value="Pool View">Pool View</option>
                        <option value="Garden View">Garden View</option>
                        <option value="Ocean View">Ocean View</option>
                        <option value="City View">City View</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="input-group">
                      <label>Number of bedroom(s)</label>
                      <select value={numBedrooms} onChange={(e) => setNumBedrooms(e.target.value)}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label>Number of living room(s)</label>
                      <select value={numLivingRooms} onChange={(e) => setNumLivingRooms(e.target.value)}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
                    <div className="input-group">
                      <label>Number of rooms (of this type)</label>
                      <input type="number" value={roomInventory} onChange={(e) => setRoomInventory(e.target.value)} />
                    </div>

                    <div className="input-group">
                      <label>Room Size</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="number" value={roomSize} onChange={(e) => setRoomSize(e.target.value)} style={{ width: '100px' }} />
                        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
                          <button type="button" onClick={() => setRoomSizeUnit('Square Feet')} style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '4px', border: 'none', background: roomSizeUnit === 'Square Feet' ? '#ff4f5a' : 'transparent', color: roomSizeUnit === 'Square Feet' ? 'white' : '#64748b', cursor: 'pointer' }}>Square Feet</button>
                          <button type="button" onClick={() => setRoomSizeUnit('Square Meter')} style={{ fontSize: '9px', padding: '4px 8px', borderRadius: '4px', border: 'none', background: roomSizeUnit === 'Square Meter' ? '#ff4f5a' : 'transparent', color: roomSizeUnit === 'Square Meter' ? 'white' : '#64748b', cursor: 'pointer' }}>Square Meter</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Description of the room</label>
                    <textarea rows="2" placeholder="Highlight features, sleeping arrangement, and views..." value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                </div>
              )}

              {/* SUB-STEP 2: SLEEPING ARRANGEMENT & OCCUPANCY */}
              {roomWizardStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Sleeping Arrangement & Occupancy</h4>
                  
                  <div className="input-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontWeight: '800' }}>Bedroom 1 Setup</label>
                    <select value={bedArrangement1} onChange={(e) => setBedArrangement1(e.target.value)} style={{ marginTop: '8px' }}>
                      <option value="1 King Bed">1 King Bed</option>
                      <option value="1 Queen Bed">1 Queen Bed</option>
                      <option value="2 Single Beds">2 Single Beds</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontWeight: '800' }}>Living Room 1 Setup</label>
                    <select value={livingArrangement1} onChange={(e) => setLivingArrangement1(e.target.value)} style={{ marginTop: '8px' }}>
                      <option value="1 Single Bed">1 Single Bed</option>
                      <option value="1 Sofa Bed">1 Sofa Bed</option>
                      <option value="No Bed">No Bed</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="input-group">
                      <label>Extra Bed Count</label>
                      <select value={extraBedsCount} onChange={(e) => setExtraBedsCount(e.target.value)}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                    
                    <div className="input-group">
                      <label>Maximum Occupancy</label>
                      <input type="number" value={maxOccupancy} onChange={(e) => setMaxOccupancy(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 3: BATHROOM DETAILS */}
              {roomWizardStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Bathroom Details</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: '#f8fafc', padding: '14px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>Bedroom 1 Attached Bathroom</span>
                      <input type="checkbox" checked={bedroom1HasBathroom} onChange={(e) => setBedroom1HasBathroom(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#ff4f5a' }} />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: '#f8fafc', padding: '14px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>Living Room 1 Bathroom</span>
                      <input type="checkbox" checked={livingRoom1HasBathroom} onChange={(e) => setLivingRoom1HasBathroom(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#ff4f5a' }} />
                    </label>
                  </div>
                </div>
              )}

              {/* SUB-STEP 4: MEAL PLAN & RATES */}
              {roomWizardStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Meal Plan, Rates & Inventory Details</h4>
                  
                  <div className="input-group">
                    <label>Meal Plan</label>
                    <select value={selectedMealPlan} onChange={(e) => setSelectedMealPlan(e.target.value)}>
                      <option value="Accommodation only">Accommodation only</option>
                      <option value="Breakfast Included">Breakfast Included</option>
                      <option value="Breakfast & Dinner Included (MAP)">Breakfast & Dinner Included (MAP)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Base Rate (INR)</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                      <span style={{ padding: '10px 14px', background: '#e2e8f0', fontWeight: 'bold' }}>₹</span>
                      <input type="number" value={roomBaseRate} onChange={(e) => setRoomBaseRate(e.target.value)} style={{ border: 'none', width: '100%', padding: '10px' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 5: AMENITY DETAILS (Split categories scroll spec) */}
              {roomWizardStep === 5 && (
                <div>
                  <h4 style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a1a', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px', marginBottom: '16px' }}>
                    Select the amenities to help guests know what to expect during their stay
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', height: '360px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* Left categories list */}
                    <div style={{ background: '#f8fafc', borderRight: '1px solid #cbd5e1', overflowY: 'auto' }}>
                      {ROOM_AMENITIES_CATEGORIES.map((cat) => {
                        const isActive = activeRoomAmenityCategory === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => setActiveRoomAmenityCategory(cat.id)}
                            style={{
                              padding: '10px 14px', fontSize: '12px', fontWeight: isActive ? '800' : '600', cursor: 'pointer',
                              background: isActive ? 'white' : 'transparent', color: isActive ? '#ff4f5a' : '#475569',
                              borderBottom: '1px solid #e2e8f0'
                            }}
                          >
                            {cat.label} (0 of {cat.count})
                          </div>
                        );
                      })}
                    </div>

                    {/* Right items checklists */}
                    <div style={{ padding: '16px', overflowY: 'auto', background: '#ffffff' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {ROOM_AMENITIES_ITEMS.map((am) => {
                          const isChecked = selectedRoomAmenities.includes(am);
                          return (
                            <label 
                              key={am} 
                              style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '4px',
                                border: '1px solid' + (isChecked ? ' #ff4f5a' : '#e2e8f0'),
                                cursor: 'pointer', fontSize: '12px'
                              }}
                            >
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={() => handleToggleRoomAmenity(am)}
                                style={{ accentColor: '#ff4f5a' }}
                              />
                              {am}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PREVIEW SUMMARY PAGE (Triggered by Preview button) --- */}
              {roomWizardStep === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h4 style={{ fontWeight: '850', fontSize: '18px', color: '#1a1a1a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Room Preview & Review</h4>
                  
                  {/* Section 1: Room Details Summary */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b' }}>Room Details</span>
                      <button type="button" onClick={() => setRoomWizardStep(1)} style={{ fontSize: '11px', color: '#ff4f5a', fontWeight: '800', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                    </div>
                    <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Room Name: <strong>{roomName || 'ww'}</strong></div>
                      <div>Room Type: <strong>{roomType}</strong></div>
                      <div>Room View: <strong>{roomView}</strong></div>
                      <div>Bedrooms count: <strong>{numBedrooms}</strong> | Living rooms count: <strong>{numLivingRooms}</strong></div>
                      <div>Inventory count: <strong>{roomInventory} units</strong></div>
                      <div>Room Size: <strong>{roomSize} {roomSizeUnit}</strong></div>
                      <div style={{ color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>"{roomDesc}"</div>
                    </div>
                  </div>

                  {/* Section 2: Sleeping occupancies */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b' }}>Sleeping Arrangement & Occupancy</span>
                      <button type="button" onClick={() => setRoomWizardStep(2)} style={{ fontSize: '11px', color: '#ff4f5a', fontWeight: '800', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                    </div>
                    <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Bedroom 1: <strong>{bedArrangement1}</strong></div>
                      <div>Living Room 1: <strong>{livingArrangement1}</strong></div>
                      <div>Extra Beds Available: <strong>{extraBedsCount} units</strong></div>
                      <div>Maximum Occupancy: <strong>{maxOccupancy} persons</strong></div>
                    </div>
                  </div>

                  {/* Section 3: BathroomDetails */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b' }}>Bathroom Details</span>
                      <button type="button" onClick={() => setRoomWizardStep(3)} style={{ fontSize: '11px', color: '#ff4f5a', fontWeight: '800', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                    </div>
                    <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Bedroom 1: <strong>{bedroom1HasBathroom ? 'Attached Bathroom' : 'No Attached Bathroom'}</strong></div>
                      <div>Living Room 1: <strong>{livingRoom1HasBathroom ? 'Bathroom available' : 'No Bathroom'}</strong></div>
                    </div>
                  </div>

                  {/* Section 4: Meal & Rates */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '6px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b' }}>Meal Plan, Rates & Inventory Details</span>
                      <button type="button" onClick={() => setRoomWizardStep(4)} style={{ fontSize: '11px', color: '#ff4f5a', fontWeight: '800', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                    </div>
                    <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Meal Plan: <strong>{selectedMealPlan}</strong></div>
                      <div>Base Rate: <strong style={{ color: '#10b981', fontSize: '14px' }}>₹ {roomBaseRate}</strong></div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer buttons */}
            <div className="modal-footer" style={{ borderTop: '1px solid #cbd5e1', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
              {roomWizardStep > 1 && roomWizardStep < 6 ? (
                <button 
                  onClick={() => setRoomWizardStep(roomWizardStep - 1)}
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Back
                </button>
              ) : roomWizardStep === 6 ? (
                <button 
                  onClick={() => setRoomWizardStep(5)}
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Back
                </button>
              ) : (
                <button 
                  onClick={() => { setIsRoomModalOpen(false); setRoomWizardStep(1); }}
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Cancel
                </button>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                {roomWizardStep === 5 && (
                  <button 
                    type="button" 
                    onClick={() => setRoomWizardStep(6)}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '12px', border: '1px solid #ff4f5a', color: '#ff4f5a' }}
                  >
                    Preview Room
                  </button>
                )}

                {roomWizardStep < 5 ? (
                  <button 
                    onClick={() => setRoomWizardStep(roomWizardStep + 1)}
                    className="btn-primary" 
                    style={{ padding: '8px 20px', fontSize: '12px', background: '#ff4f5a', border: 'none' }}
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={handleSaveRoom}
                    className="btn-primary" 
                    style={{ padding: '8px 24px', fontSize: '12px', background: '#10b981', border: 'none', color: 'white' }}
                  >
                    Save Room ✅
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


