// B2B Partner Onboarding database service
import { mockHotels, mockPackages } from './mockDatabase';
import { db, IS_FIREBASE_ACTIVE } from '../firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc } from 'firebase/firestore';

const initConnectDB = async () => {
  if (IS_FIREBASE_ACTIVE && db) {
    try {
      const usersRef = collection(db, "connect_users");
      const snap = await getDocs(usersRef);
      if (snap.empty) {
        await addDoc(usersRef, { uid: "partner-rj", email: "rj@makemytrip.com", password: "rj123", name: "Rishabh Jaiswal" });
        await addDoc(usersRef, { uid: "admin-id", email: "admin@makemytrip.com", password: "admin123", name: "System Admin", role: "admin" });
      }
    } catch (e) {
      console.warn("Firestore seeding error:", e);
    }
  } else {
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
  }
};

initConnectDB();

// 1. Merchant & Admin Auth
export async function connectRegisterPartner(email, password, name) {
  if (IS_FIREBASE_ACTIVE && db) {
    const usersRef = collection(db, "connect_users");
    const q = query(usersRef, where("email", "==", email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      throw new Error("Partner email already registered!");
    }
    const newUser = {
      uid: "partner-" + Math.random().toString(36).substring(2, 9),
      email,
      password,
      name: name || "Partner"
    };
    await addDoc(usersRef, newUser);
    return newUser;
  }

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
  if (IS_FIREBASE_ACTIVE && db) {
    const usersRef = collection(db, "connect_users");
    const q = query(usersRef, where("email", "==", email), where("password", "==", password));
    const snap = await getDocs(q);
    if (snap.empty) {
      throw new Error("Invalid partner credentials!");
    }
    return snap.docs[0].data();
  }

  const users = JSON.parse(localStorage.getItem('connect_users')) || [];
  const matched = users.find(u => u.email === email && u.password === password);
  if (!matched) {
    throw new Error("Invalid partner credentials!");
  }
  return matched;
}

// 2. Property Onboarding Writes & Reads
export async function connectAddProperty(property, vendorId) {
  const propertyId = "prop-" + Date.now();
  let leasedDocData = null;
  let relationshipDocData = null;

  const cleanProperty = { 
    ...property, 
    id: propertyId, 
    vendorId, 
    status: "Pending Review" 
  };

  if (cleanProperty.finance) {
    if (cleanProperty.finance.leasedDoc) {
      leasedDocData = cleanProperty.finance.leasedDoc.data;
      cleanProperty.finance.leasedDoc = {
        name: cleanProperty.finance.leasedDoc.name,
        type: cleanProperty.finance.leasedDoc.type,
        hasData: !!leasedDocData
      };
    }
    if (cleanProperty.finance.relationshipDoc) {
      relationshipDocData = cleanProperty.finance.relationshipDoc.data;
      cleanProperty.finance.relationshipDoc = {
        name: cleanProperty.finance.relationshipDoc.name,
        type: cleanProperty.finance.relationshipDoc.type,
        hasData: !!relationshipDocData
      };
    }
  }

  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    await addDoc(propertiesRef, cleanProperty);

    if (leasedDocData || relationshipDocData) {
      const docsRef = collection(db, "connect_property_docs");
      await addDoc(docsRef, {
        propertyId,
        leasedDocData,
        relationshipDocData
      });
    }
    return cleanProperty;
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  properties.push(cleanProperty);
  localStorage.setItem('connect_properties', JSON.stringify(properties));

  if (leasedDocData || relationshipDocData) {
    const docs = JSON.parse(localStorage.getItem('connect_property_docs')) || [];
    docs.push({
      propertyId,
      leasedDocData,
      relationshipDocData
    });
    localStorage.setItem('connect_property_docs', JSON.stringify(docs));
  }

  return cleanProperty;
}

export async function connectGetPropertiesForPartner(vendorId) {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("vendorId", "==", vendorId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  return properties.filter(p => p.vendorId === vendorId);
}

// 3. Admin & B2C Connection Services
export async function dbGetPendingListings() {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("status", "==", "Pending Review"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  return properties.filter(p => p.status === 'Pending Review');
}

export async function dbUpdateListingStatus(propertyId, type, status, rejectionReason = '') {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("id", "==", propertyId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      await updateDoc(docRef, { status, rejectionReason });
      return true;
    }
    return false;
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const updated = properties.map(p => {
    if (p.id === propertyId) {
      return { ...p, status: status, rejectionReason: rejectionReason }; // status: 'approved' or 'rejected'
    }
    return p;
  });
  localStorage.setItem('connect_properties', JSON.stringify(updated));
  return true;
}

export async function dbGetAdminListings(statusFilter) {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("status", "==", statusFilter));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  return properties.filter(p => p.status === statusFilter);
}

export async function dbGetHotels() {
  let formattedProperties = [];
  
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("status", "==", "approved"));
    const snap = await getDocs(q);
    const properties = snap.docs.map(doc => doc.data());
    
    formattedProperties = properties
      .filter(p => p.propertyType === 'Hotel' || p.propertyType === 'hotel')
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
  } else {
    const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
    formattedProperties = properties
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
  }

  const seeded = mockHotels.map(h => ({ ...h, status: 'approved' }));
  return [...seeded, ...formattedProperties];
}

export async function dbGetPackages() {
  const seeded = mockPackages.map(p => ({ ...p, status: 'approved' }));
  return seeded;
}

export async function dbGetBookingsForVendor(vendorId) {
  const bookings = JSON.parse(localStorage.getItem('mmt_bookings')) || [];
  return bookings.filter(b => b.item && b.item.vendorId === vendorId);
}

export async function dbUpdatePropertyDetails(propertyId, updatedRooms, updatedPhotos, updatedCoverPhoto) {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("id", "==", propertyId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      const currentData = snap.docs[0].data();

      let updatePayload = { 
        rooms: updatedRooms,
        uploadedPhotos: updatedPhotos,
        coverPhoto: updatedCoverPhoto,
        image: updatedCoverPhoto
      };

      if (currentData.finance && (currentData.finance.leasedDoc?.data || currentData.finance.relationshipDoc?.data)) {
        const leasedDocData = currentData.finance.leasedDoc?.data || null;
        const relationshipDocData = currentData.finance.relationshipDoc?.data || null;
        
        const docsRef = collection(db, "connect_property_docs");
        const docQ = query(docsRef, where("propertyId", "==", propertyId));
        const docSnap = await getDocs(docQ);
        if (docSnap.empty) {
          await addDoc(docsRef, {
            propertyId,
            leasedDocData,
            relationshipDocData
          });
        }

        updatePayload.finance = {
          ...currentData.finance,
          leasedDoc: currentData.finance.leasedDoc ? {
            name: currentData.finance.leasedDoc.name,
            type: currentData.finance.leasedDoc.type,
            hasData: !!leasedDocData
          } : null,
          relationshipDoc: currentData.finance.relationshipDoc ? {
            name: currentData.finance.relationshipDoc.name,
            type: currentData.finance.relationshipDoc.type,
            hasData: !!relationshipDocData
          } : null
        };
      }

      await updateDoc(docRef, updatePayload);
      return true;
    }
    return false;
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const updated = properties.map(p => {
    if (p.id === propertyId) {
      let cleanFinance = p.finance;
      if (p.finance && (p.finance.leasedDoc?.data || p.finance.relationshipDoc?.data)) {
        const docs = JSON.parse(localStorage.getItem('connect_property_docs')) || [];
        const found = docs.find(d => d.propertyId === propertyId);
        if (!found) {
          docs.push({
            propertyId,
            leasedDocData: p.finance.leasedDoc?.data || null,
            relationshipDocData: p.finance.relationshipDoc?.data || null
          });
          localStorage.setItem('connect_property_docs', JSON.stringify(docs));
        }
        cleanFinance = {
          ...p.finance,
          leasedDoc: p.finance.leasedDoc ? {
            name: p.finance.leasedDoc.name,
            type: p.finance.leasedDoc.type,
            hasData: !!p.finance.leasedDoc.data
          } : null,
          relationshipDoc: p.finance.relationshipDoc ? {
            name: p.finance.relationshipDoc.name,
            type: p.finance.relationshipDoc.type,
            hasData: !!p.finance.relationshipDoc.data
          } : null
        };
      }
      return { 
        ...p, 
        rooms: updatedRooms,
        uploadedPhotos: updatedPhotos,
        coverPhoto: updatedCoverPhoto,
        image: updatedCoverPhoto,
        finance: cleanFinance
      };
    }
    return p;
  });
  localStorage.setItem('connect_properties', JSON.stringify(updated));
  return true;
}

export async function dbGetPropertyDocuments(propertyId) {
  if (IS_FIREBASE_ACTIVE && db) {
    const docsRef = collection(db, "connect_property_docs");
    const q = query(docsRef, where("propertyId", "==", propertyId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data();
    }
    return null;
  }
  const docs = JSON.parse(localStorage.getItem('connect_property_docs')) || [];
  return docs.find(d => d.propertyId === propertyId) || null;
}

export async function dbDeleteProperty(propertyId) {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("id", "==", propertyId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      await deleteDoc(docRef);
      return true;
    }
    return false;
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const filtered = properties.filter(p => p.id !== propertyId);
  localStorage.setItem('connect_properties', JSON.stringify(filtered));
  return true;
}

export async function dbSendChatMessage(partnerId, senderRole, senderName, text, fileData = null, fileType = null, fileName = null) {
  const msg = {
    partnerId,
    senderRole, // 'partner' or 'admin'
    senderName,
    text,
    fileData,
    fileType,
    fileName,
    timestamp: Date.now()
  };

  if (IS_FIREBASE_ACTIVE && db) {
    const chatRef = collection(db, "connect_chats");
    await addDoc(chatRef, msg);
    return msg;
  }

  const chats = JSON.parse(localStorage.getItem('connect_chats')) || [];
  chats.push(msg);
  localStorage.setItem('connect_chats', JSON.stringify(chats));
  return msg;
}

export async function dbGetChatMessages(partnerId) {
  if (IS_FIREBASE_ACTIVE && db) {
    const chatRef = collection(db, "connect_chats");
    const q = query(chatRef, where("partnerId", "==", partnerId));
    const snap = await getDocs(q);
    const msgs = snap.docs.map(doc => doc.data());
    return msgs.sort((a, b) => a.timestamp - b.timestamp);
  }

  const chats = JSON.parse(localStorage.getItem('connect_chats')) || [];
  return chats
    .filter(c => c.partnerId === partnerId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export async function dbGetAllChatsForAdmin() {
  if (IS_FIREBASE_ACTIVE && db) {
    const chatRef = collection(db, "connect_chats");
    const snap = await getDocs(chatRef);
    const msgs = snap.docs.map(doc => doc.data());
    return msgs.sort((a, b) => a.timestamp - b.timestamp);
  }

  const chats = JSON.parse(localStorage.getItem('connect_chats')) || [];
  return chats.sort((a, b) => a.timestamp - b.timestamp);
}
