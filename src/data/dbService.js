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
  const photosArray = property.uploadedPhotos || [];

  const cleanProperty = { 
    ...property, 
    id: propertyId, 
    vendorId, 
    status: "Pending Review",
    uploadedPhotos: []
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
    if (photosArray.length > 0) {
      await dbSavePropertyPhotos(propertyId, photosArray);
    }
    return { ...cleanProperty, uploadedPhotos: photosArray };
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
  if (photosArray.length > 0) {
    await dbSavePropertyPhotos(propertyId, photosArray);
  }

  return { ...cleanProperty, uploadedPhotos: photosArray };
}

export async function connectGetPropertiesForPartner(vendorId) {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("vendorId", "==", vendorId));
    const snap = await getDocs(q);
    const properties = snap.docs.map(doc => doc.data());
    
    return await Promise.all(properties.map(async (p) => {
      const photos = await dbGetPropertyPhotos(p.id);
      return {
        ...p,
        uploadedPhotos: photos || p.uploadedPhotos || []
      };
    }));
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const filtered = properties.filter(p => p.vendorId === vendorId);
  return filtered.map(p => {
    const allPhotos = JSON.parse(localStorage.getItem('connect_property_photos')) || [];
    const photos = allPhotos.find(doc => doc.propertyId === p.id)?.photos || p.uploadedPhotos || [];
    return { ...p, uploadedPhotos: photos };
  });
}

// 3. Admin & B2C Connection Services
export async function dbGetPendingListings() {
  if (IS_FIREBASE_ACTIVE && db) {
    const propertiesRef = collection(db, "connect_properties");
    const q = query(propertiesRef, where("status", "==", "Pending Review"));
    const snap = await getDocs(q);
    const properties = snap.docs.map(doc => doc.data());
    return await Promise.all(properties.map(async (p) => {
      const photos = await dbGetPropertyPhotos(p.id);
      return {
        ...p,
        uploadedPhotos: photos || p.uploadedPhotos || []
      };
    }));
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const filtered = properties.filter(p => p.status === 'Pending Review');
  return filtered.map(p => {
    const allPhotos = JSON.parse(localStorage.getItem('connect_property_photos')) || [];
    const photos = allPhotos.find(doc => doc.propertyId === p.id)?.photos || p.uploadedPhotos || [];
    return { ...p, uploadedPhotos: photos };
  });
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
    const properties = snap.docs.map(doc => doc.data());
    return await Promise.all(properties.map(async (p) => {
      const photos = await dbGetPropertyPhotos(p.id);
      return {
        ...p,
        uploadedPhotos: photos || p.uploadedPhotos || []
      };
    }));
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const filtered = properties.filter(p => p.status === statusFilter);
  return filtered.map(p => {
    const allPhotos = JSON.parse(localStorage.getItem('connect_property_photos')) || [];
    const photos = allPhotos.find(doc => doc.propertyId === p.id)?.photos || p.uploadedPhotos || [];
    return { ...p, uploadedPhotos: photos };
  });
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
        uploadedPhotos: [], // Strip photos from main document
        coverPhoto: updatedCoverPhoto,
        image: updatedCoverPhoto
      };

      let leasedDocData = null;
      let relationshipDocData = null;
      let hasLegacyDocs = false;

      if (currentData.finance) {
        if (currentData.finance.leasedDoc) {
          if (typeof currentData.finance.leasedDoc === 'string' && currentData.finance.leasedDoc.startsWith('data:')) {
            leasedDocData = currentData.finance.leasedDoc;
            hasLegacyDocs = true;
          } else if (currentData.finance.leasedDoc.data) {
            leasedDocData = currentData.finance.leasedDoc.data;
            hasLegacyDocs = true;
          }
        }
        if (currentData.finance.relationshipDoc) {
          if (typeof currentData.finance.relationshipDoc === 'string' && currentData.finance.relationshipDoc.startsWith('data:')) {
            relationshipDocData = currentData.finance.relationshipDoc;
            hasLegacyDocs = true;
          } else if (currentData.finance.relationshipDoc.data) {
            relationshipDocData = currentData.finance.relationshipDoc.data;
            hasLegacyDocs = true;
          }
        }
      }

      if (hasLegacyDocs) {
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
            name: typeof currentData.finance.leasedDoc === 'string' ? 'Leased_Document.pdf' : (currentData.finance.leasedDoc.name || 'Leased_Document.pdf'),
            type: typeof currentData.finance.leasedDoc === 'string' ? 'application/pdf' : (currentData.finance.leasedDoc.type || 'application/pdf'),
            hasData: !!leasedDocData
          } : null,
          relationshipDoc: currentData.finance.relationshipDoc ? {
            name: typeof currentData.finance.relationshipDoc === 'string' ? 'Relationship_Proof.pdf' : (currentData.finance.relationshipDoc.name || 'Relationship_Proof.pdf'),
            type: typeof currentData.finance.relationshipDoc === 'string' ? 'application/pdf' : (currentData.finance.relationshipDoc.type || 'application/pdf'),
            hasData: !!relationshipDocData
          } : null
        };
      }

      await updateDoc(docRef, updatePayload);
      await dbSavePropertyPhotos(propertyId, updatedPhotos);
      return true;
    }
    return false;
  }

  const properties = JSON.parse(localStorage.getItem('connect_properties')) || [];
  const updated = properties.map(p => {
    if (p.id === propertyId) {
      let cleanFinance = p.finance;
      let leasedDocData = null;
      let relationshipDocData = null;
      let hasLegacyDocs = false;

      if (p.finance) {
        if (p.finance.leasedDoc) {
          if (typeof p.finance.leasedDoc === 'string' && p.finance.leasedDoc.startsWith('data:')) {
            leasedDocData = p.finance.leasedDoc;
            hasLegacyDocs = true;
          } else if (p.finance.leasedDoc.data) {
            leasedDocData = p.finance.leasedDoc.data;
            hasLegacyDocs = true;
          }
        }
        if (p.finance.relationshipDoc) {
          if (typeof p.finance.relationshipDoc === 'string' && p.finance.relationshipDoc.startsWith('data:')) {
            relationshipDocData = p.finance.relationshipDoc;
            hasLegacyDocs = true;
          } else if (p.finance.relationshipDoc.data) {
            relationshipDocData = p.finance.relationshipDoc.data;
            hasLegacyDocs = true;
          }
        }
      }

      if (hasLegacyDocs) {
        const docs = JSON.parse(localStorage.getItem('connect_property_docs')) || [];
        const found = docs.find(d => d.propertyId === propertyId);
        if (!found) {
          docs.push({
            propertyId,
            leasedDocData,
            relationshipDocData
          });
          localStorage.setItem('connect_property_docs', JSON.stringify(docs));
        }
        cleanFinance = {
          ...p.finance,
          leasedDoc: p.finance.leasedDoc ? {
            name: typeof p.finance.leasedDoc === 'string' ? 'Leased_Document.pdf' : (p.finance.leasedDoc.name || 'Leased_Document.pdf'),
            type: typeof p.finance.leasedDoc === 'string' ? 'application/pdf' : (p.finance.leasedDoc.type || 'application/pdf'),
            hasData: !!leasedDocData
          } : null,
          relationshipDoc: p.finance.relationshipDoc ? {
            name: typeof p.finance.relationshipDoc === 'string' ? 'Relationship_Proof.pdf' : (p.finance.relationshipDoc.name || 'Relationship_Proof.pdf'),
            type: typeof p.finance.relationshipDoc === 'string' ? 'application/pdf' : (p.finance.relationshipDoc.type || 'application/pdf'),
            hasData: !!relationshipDocData
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
