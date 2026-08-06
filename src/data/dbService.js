// B2B Partner Onboarding database service
import { mockHotels, mockPackages } from './mockDatabase';

const initConnectDB = () => {
  if (!localStorage.getItem('connect_users')) {
    // Seed default partner accounts & System Admin credentials
    localStorage.setItem('connect_users', JSON.stringify([
      { uid: "partner-rj", email: "rj@makemytrip.com", password: "rj123", name: "Rishabh Jaiswal" },
      { uid: "admin-id", email: "admin@makemytrip.com", password: "admin123", name: "System Admin", role: "admin" }
    ]));
  }
  if (!localStorage.getItem('connect_properties')) {
    // Seed default listed property
    localStorage.setItem('connect_properties', JSON.stringify([
      {
        id: "prop-seed-1",
        vendorId: "partner-rj",
        propertyType: "Hotel",
        subType: "Resort",
        name: "Grand Candolim Palace & Spa",
        stars: "5",
        yearBuilt: "2018",
        acceptingBookingSince: "2019",
        channelManager: "No",
        city: "Goa",
        contactInfo: {
          email: "reservations@palace.com",
          mobile: "9876543210",
          whatsapp: true,
          landline: "0832-2435678"
        },
        address: "Mobor Beach, Candolim, Goa, Pincode - 403515",
        amenities: ["Air Conditioning", "Parking", "Room service", "Swimming Pool", "Wifi", "CCTV", "Lounge", "Smoke detector"],
        rooms: [
          { type: "Deluxe Ocean View", price: 8500, count: 12 },
          { type: "Luxury Lagoon Suite", price: 15000, count: 4 }
        ],
        status: "approved"
      }
    ]));
  }
};

initConnectDB();

// 1. Merchant & Admin Auth
export async function connectRegisterPartner(email, password, name) {
  const users = JSON.parse(localStorage.getItem('connect_users')) || [];
  if (users.some(u => u.email === email)) {
    throw new Error("Partner email already registered!");
  }
  const newUser = {
    uid: "partner-" + Math.random().toString(36).substring(2, 9),
    email,
    password,
    name: name || "Partner"
  };
  users.push(newUser);
  localStorage.setItem('connect_users', JSON.stringify(users));
  return newUser;
}

export async function connectLoginPartner(email, password) {
  const users = JSON.parse(localStorage.getItem('connect_users')) || [];
  const matched = users.find(u => u.email === email && u.password === password);
  if (!matched) {
    throw new Error("Invalid partner credentials!");
  }
  return matched;
}

// 2. Property Onboarding Writes & Reads
export async function connectAddProperty(property, vendorId) {
  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const newProp = {
    ...property,
    id: "prop-" + Date.now(),
    vendorId,
    status: "Pending Review" // Starts in Pending Review for Admin verification flow
  };
  properties.push(newProp);
  localStorage.setItem('connect_properties', JSON.stringify(properties));
  return newProp;
}

export async function connectGetPropertiesForPartner(vendorId) {
  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  return properties.filter(p => p.vendorId === vendorId);
}

// 3. Admin & B2C Connection Services
export async function dbGetPendingListings() {
  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  return properties.filter(p => p.status === 'Pending Review');
}

export async function dbUpdateListingStatus(propertyId, type, status) {
  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const updated = properties.map(p => {
    if (p.id === propertyId) {
      return { ...p, status: status }; // status: 'approved' or 'rejected'
    }
    return p;
  });
  localStorage.setItem('connect_properties', JSON.stringify(updated));
  return true;
}

export async function dbGetHotels() {
  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  
  // Format partner property details to match B2C Hotel Details structure
  const formattedProperties = properties
    .filter(p => (p.propertyType === 'Hotel' || p.propertyType === 'hotel') && p.status === 'approved')
    .map(p => ({
      id: p.id,
      city: p.city || 'Goa',
      name: p.name,
      stars: Number(p.stars) || 3,
      rating: 4.5,
      reviewsCount: 12,
      price: p.rooms && p.rooms.length > 0 ? Number(p.rooms[0].price) || Number(p.rooms[0].baseRate) || 1200 : 1500,
      address: p.address,
      amenities: p.amenities || [],
      image: p.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      description: p.description || "A premium listed property verified under MakeMyTrip network.",
      rooms: (p.rooms || []).map(r => ({
        type: r.type || r.roomType || 'Deluxe Apartment',
        price: Number(r.price) || Number(r.baseRate) || 1200,
        description: r.description || `Beautiful Room of type ${r.type || 'Apartment'} configured in Connect Wizard.`
      })),
      status: 'approved'
    }));

  const seeded = mockHotels.map(h => ({ ...h, status: 'approved' }));
  return [...seeded, ...formattedProperties];
}

export async function dbGetPackages() {
  const seeded = mockPackages.map(p => ({ ...p, status: 'approved' }));
  return seeded;
}

export async function dbGetBookingsForVendor(vendorId) {
  const bookings = JSON.parse(localStorage.getItem('mmt_bookings')) || [];
  // Return bookings for items owned by this vendor
  return bookings.filter(b => b.item && b.item.vendorId === vendorId);
}
