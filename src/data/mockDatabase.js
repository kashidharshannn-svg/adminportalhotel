// Mock Travel Database for Flights, Hotels, Trains, Buses, and Packages

export const mockFlights = [
  // Domestic
  {
    id: "f1",
    type: "domestic",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    airline: "IndiGo",
    logo: "✈️",
    flightNo: "6E-2014",
    departureTime: "06:00",
    arrivalTime: "08:15",
    duration: "2h 15m",
    price: 4999,
    stops: 0,
    class: "Economy",
    date: "2026-08-10"
  },
  {
    id: "f2",
    type: "domestic",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    airline: "Air India",
    logo: "🛩️",
    flightNo: "AI-805",
    departureTime: "08:00",
    arrivalTime: "10:10",
    duration: "2h 10m",
    price: 5499,
    stops: 0,
    class: "Economy",
    date: "2026-08-10"
  },
  {
    id: "f3",
    type: "domestic",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    airline: "Vistara",
    logo: "✈️",
    flightNo: "UK-985",
    departureTime: "17:30",
    arrivalTime: "19:45",
    duration: "2h 15m",
    price: 8999,
    stops: 0,
    class: "Business",
    date: "2026-08-10"
  },
  {
    id: "f4",
    type: "domestic",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    airline: "IndiGo",
    logo: "✈️",
    flightNo: "6E-5314",
    departureTime: "12:15",
    arrivalTime: "15:45",
    duration: "3h 30m",
    price: 3899,
    stops: 1,
    via: "Jaipur (JAI)",
    class: "Economy",
    date: "2026-08-10"
  },
  {
    id: "f5",
    type: "domestic",
    from: "Delhi (DEL)",
    to: "Goa (GOI)",
    airline: "IndiGo",
    logo: "✈️",
    flightNo: "6E-2415",
    departureTime: "11:20",
    arrivalTime: "13:50",
    duration: "2h 30m",
    price: 6199,
    stops: 0,
    class: "Economy",
    date: "2026-08-10"
  },
  {
    id: "f6",
    type: "domestic",
    from: "Delhi (DEL)",
    to: "Goa (GOI)",
    airline: "Vistara",
    logo: "✈️",
    flightNo: "UK-845",
    departureTime: "14:10",
    arrivalTime: "16:40",
    duration: "2h 30m",
    price: 7499,
    stops: 0,
    class: "Economy",
    date: "2026-08-10"
  },
  {
    id: "f7",
    type: "domestic",
    from: "Mumbai (BOM)",
    to: "Bangalore (BLR)",
    airline: "Air India Express",
    logo: "🛩️",
    flightNo: "I5-1560",
    departureTime: "21:00",
    arrivalTime: "22:45",
    duration: "1h 45m",
    price: 3499,
    stops: 0,
    class: "Economy",
    date: "2026-08-10"
  },

  // International
  {
    id: "f8",
    type: "international",
    from: "Delhi (DEL)",
    to: "Dubai (DXB)",
    airline: "Emirates",
    logo: "🇦🇪",
    flightNo: "EK-511",
    departureTime: "10:55",
    arrivalTime: "13:00",
    duration: "3h 35m",
    price: 18500,
    stops: 0,
    class: "Economy",
    date: "2026-08-15"
  },
  {
    id: "f9",
    type: "international",
    from: "Delhi (DEL)",
    to: "Dubai (DXB)",
    airline: "SpiceJet",
    logo: "✈️",
    flightNo: "SG-15",
    departureTime: "07:20",
    arrivalTime: "09:40",
    duration: "3h 50m",
    price: 12200,
    stops: 0,
    class: "Economy",
    date: "2026-08-15"
  },
  {
    id: "f10",
    type: "international",
    from: "Delhi (DEL)",
    to: "London (LHR)",
    airline: "British Airways",
    logo: "🇬🇧",
    flightNo: "BA-142",
    departureTime: "02:15",
    arrivalTime: "07:15",
    duration: "9h 30m",
    price: 49500,
    stops: 0,
    class: "Economy",
    date: "2026-08-15"
  },
  {
    id: "f11",
    type: "international",
    from: "Delhi (DEL)",
    to: "London (LHR)",
    airline: "Air India",
    logo: "🛩️",
    flightNo: "AI-111",
    departureTime: "13:15",
    arrivalTime: "18:30",
    duration: "9h 45m",
    price: 45000,
    stops: 0,
    class: "Economy",
    date: "2026-08-15"
  },
  {
    id: "f12",
    type: "international",
    from: "Delhi (DEL)",
    to: "Paris (CDG)",
    airline: "Air France",
    logo: "🇫🇷",
    flightNo: "AF-225",
    departureTime: "00:35",
    arrivalTime: "06:00",
    duration: "9h 55m",
    price: 52000,
    stops: 0,
    class: "Economy",
    date: "2026-08-15"
  },
  {
    id: "f13",
    type: "international",
    from: "Delhi (DEL)",
    to: "Singapore (SIN)",
    airline: "Singapore Airlines",
    logo: "🇸🇬",
    flightNo: "SQ-403",
    departureTime: "21:50",
    arrivalTime: "06:10",
    duration: "5h 50m",
    price: 24000,
    stops: 0,
    class: "Economy",
    date: "2026-08-15"
  }
];

export const mockHotels = [
  {
    id: "h1",
    city: "Goa",
    name: "The Leela Goa Resort & Spa",
    stars: 5,
    rating: 4.8,
    reviewsCount: 1840,
    price: 14500,
    address: "Mobor, Cavelossim, Goa, 403731",
    amenities: ["Free WiFi", "Private Beach", "Swimming Pool", "Spa & Wellness", "Bar & Restro", "Room Service"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    description: "Nestled between the Arabian Sea and the River Sal, The Leela Goa is a luxurious haven offering ultimate tranquility with 75 acres of lush landscaped gardens.",
    rooms: [
      { type: "Conservatory Premiere Room", price: 14500, description: "Elegant room with private balcony overlooking the lagoon." },
      { type: "Lagoon Suite", price: 21000, description: "Generously sized suite with separate living room and luxury bath." },
      { type: "Club Villa", price: 42000, description: "Ultra-luxurious oceanfront villa with personal butler service." }
    ]
  },
  {
    id: "h2",
    city: "Goa",
    name: "Whispering Palms Beach Resort",
    stars: 4,
    rating: 4.1,
    reviewsCount: 2310,
    price: 5800,
    address: "Sinquerim Beach, Candolim, Goa, 403515",
    amenities: ["Free WiFi", "Near Beach", "Swimming Pool", "Fitness Center", "All Inclusive Options"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    description: "Located close to the historic Aguada Fort, Whispering Palms offers cozy accommodation amidst landscaped lawns and a vibrant resort vibe.",
    rooms: [
      { type: "Standard Room", price: 5800, description: "Comes with twin beds and poolside views." },
      { type: "Studio Room", price: 7200, description: "Larger room with contemporary interiors and sit-out area." }
    ]
  },
  {
    id: "h3",
    city: "Delhi",
    name: "Taj Palace, New Delhi",
    stars: 5,
    rating: 4.9,
    reviewsCount: 3950,
    price: 12000,
    address: "Sardar Patel Marg, Diplomatic Enclave, New Delhi, 110021",
    amenities: ["Free WiFi", "Swimming Pool", "Golf Course", "Fine Dining", "Luxury Spa", "Gym"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Spread over six acres of lush heritage gardens, Taj Palace is an iconic landmark representing royal luxury and state-of-the-art hospitality in the capital.",
    rooms: [
      { type: "Superior Room (King)", price: 12000, description: "Cozy spaces presenting city views with Taj signature service." },
      { type: "Deluxe Suite", price: 22000, description: "Features rich wooden panels, distinct study, and luxury amenities." }
    ]
  },
  {
    id: "h4",
    city: "Mumbai",
    name: "The Taj Mahal Palace",
    stars: 5,
    rating: 4.9,
    reviewsCount: 5400,
    price: 18500,
    address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001",
    amenities: ["Sea View Rooms", "Free WiFi", "Art Gallery", "Multiple Restaurants", "Pool & Spa"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "An architectural marvel overlooking the Gateway of India, playing host to kings, presidents, and global icons for over a century.",
    rooms: [
      { type: "Heritage Superior Room", price: 18500, description: "Charming rooms located in the historic palace wing." },
      { type: "Taj Signature Sea View Room", price: 26000, description: "Unrivalled, panoramic views of the Arabian Sea and Gateway." }
    ]
  },
  {
    id: "h5",
    city: "Dubai",
    name: "Atlantis The Palm",
    stars: 5,
    rating: 4.7,
    reviewsCount: 12050,
    price: 32000,
    address: "Crescent Rd, The Palm Jumeirah, Dubai",
    amenities: ["Waterpark Access", "Free WiFi", "Private Beach", "Underwater Aquarium", "24/7 Room Service"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Perched on the crescent of the Palm island, Atlantis is a majestic ocean-themed destination resort offering thrilling experiences and luxury accommodations.",
    rooms: [
      { type: "Ocean King Room", price: 32000, description: "Spacious bedroom with beautiful sights of the Arabian Gulf." },
      { type: "Imperial Club Room", price: 44000, description: "Includes VIP lounge access, private check-in, and complimentary daily drinks." }
    ]
  },
  {
    id: "h6",
    city: "Srinagar",
    name: "The Lalit Grand Palace Srinagar",
    stars: 5,
    rating: 4.6,
    reviewsCount: 1540,
    price: 16000,
    address: "Gupkar Road, Srinagar, Jammu & Kashmir 190001",
    amenities: ["Dal Lake View", "Free WiFi", "Indoor Pool", "Heritage Walks", "Lawn Dining"],
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=800&q=80",
    description: "Designed by Maharaja Pratap Singh in 1910, this heritage property offers royal luxury surrounded by the majestic Himalayan ranges and Dal Lake views.",
    rooms: [
      { type: "Deluxe Palace Room", price: 16000, description: "Spacious room reflecting royal Kashmiri architecture and carpets." },
      { type: "Palace Suite", price: 25000, description: "Stately suite with traditional decorations and Breathtaking views." }
    ]
  }
];

export const mockTrains = [
  {
    id: "t1",
    trainNo: "22436",
    name: "NDLS VANDE BHARAT",
    from: "Delhi (NDLS)",
    to: "Varanasi (BSB)",
    departureTime: "06:00",
    arrivalTime: "14:00",
    duration: "8h 00m",
    runsOn: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"],
    classes: [
      { type: "CC", price: 1750, seats: 45 },
      { type: "EC", price: 3200, seats: 12 }
    ]
  },
  {
    id: "t2",
    trainNo: "12424",
    name: "NDLS DBRT RAJDHANI",
    from: "Delhi (NDLS)",
    to: "Varanasi (BSB)",
    departureTime: "16:10",
    arrivalTime: "01:25",
    duration: "9h 15m",
    runsOn: ["Daily"],
    classes: [
      { type: "3A", price: 1450, seats: 120 },
      { type: "2A", price: 2100, seats: 62 },
      { type: "1A", price: 3500, seats: 8 }
    ]
  },
  {
    id: "t3",
    trainNo: "12952",
    name: "MUMBAI RAJDHANI",
    from: "Delhi (NDLS)",
    to: "Mumbai (BCT)",
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    runsOn: ["Daily"],
    classes: [
      { type: "3A", price: 2050, seats: 80 },
      { type: "2A", price: 2860, seats: 34 },
      { type: "1A", price: 4730, seats: 6 }
    ]
  },
  {
    id: "t4",
    trainNo: "12954",
    name: "AUGUST KRANTI RAJDHANI",
    from: "Delhi (NDLS)",
    to: "Mumbai (BCT)",
    departureTime: "17:15",
    arrivalTime: "09:45",
    duration: "16h 30m",
    runsOn: ["Daily"],
    classes: [
      { type: "3A", price: 1980, seats: 95 },
      { type: "2A", price: 2790, seats: 42 },
      { type: "1A", price: 4650, seats: 10 }
    ]
  }
];

export const mockBuses = [
  {
    id: "b1",
    operator: "Zingbus Plus",
    type: "A/C Sleeper (2+1)",
    rating: 4.4,
    reviewsCount: 852,
    departureTime: "20:30",
    arrivalTime: "07:30",
    duration: "11h 00m",
    from: "Delhi",
    to: "Manali",
    price: 1199,
    seatsAvailable: 18,
    amenities: ["Live Tracking", "Blanket", "Water Bottle", "Charging Point"]
  },
  {
    id: "b2",
    operator: "Laxmi Holidays",
    type: "Volvo Multi-Axle A/C Semi-Sleeper (2+2)",
    rating: 4.2,
    reviewsCount: 1450,
    departureTime: "21:30",
    arrivalTime: "08:45",
    duration: "11h 15m",
    from: "Delhi",
    to: "Manali",
    price: 999,
    seatsAvailable: 24,
    amenities: ["Water Bottle", "Charging Point", "Emergency Contact"]
  },
  {
    id: "b3",
    operator: "IntrCity SmartBus",
    type: "A/C Sleeper (2+1) premium",
    rating: 4.6,
    reviewsCount: 2100,
    departureTime: "22:00",
    arrivalTime: "08:00",
    duration: "10h 00m",
    from: "Delhi",
    to: "Manali",
    price: 1450,
    seatsAvailable: 12,
    amenities: ["Live Tracking", "CCTV", "Blanket", "Water Bottle", "USB Charger", "Washroom onboard"]
  },
  {
    id: "b4",
    operator: "VRL Travels",
    type: "Multi-Axle Luxury A/C Sleeper",
    rating: 4.3,
    reviewsCount: 940,
    departureTime: "18:00",
    arrivalTime: "09:00",
    duration: "15h 00m",
    from: "Bangalore",
    to: "Goa",
    price: 1800,
    seatsAvailable: 15,
    amenities: ["Blanket", "Water Bottle", "USB Charger", "Movie Screen"]
  }
];

export const mockPackages = [
  {
    id: "p1",
    type: "domestic",
    destination: "Kashmir",
    title: "Scenic Kashmir - Paradise on Earth",
    duration: "5 Nights / 6 Days",
    rating: 4.8,
    reviewsCount: 420,
    price: 19999,
    image: "https://images.unsplash.com/photo-1566837430541-00626e2e5058?auto=format&fit=crop&w=800&q=80",
    highlights: ["Shikara Ride on Dal Lake", "Houseboat Stay", "Gondola ride in Gulmarg", "Pahalgam Valley Tour"],
    inclusions: ["3 Star Hotels", "Daily Breakfast & Dinner", "Airport Transfers", "Sightseeing Cab"],
    itinerary: [
      { day: 1, title: "Arrival in Srinagar & Dal Lake Shikara Ride", details: "On arrival at Srinagar Airport, meet our representative and transfer to your Houseboat. In the evening, enjoy a 1-hour romantic Shikara ride on the lake." },
      { day: 2, title: "Srinagar to Gulmarg Excursion", details: "Travel to Gulmarg. Experience the famous Gondola Cable Car Ride (phases 1 & 2 optional) up to Apharwat peak. Return to Srinagar houseboat/hotel for dinner." },
      { day: 3, title: "Srinagar City Tour", details: "Explore the Shalimar Bagh, Nishat Bagh, and Chashme Shahi Mughal gardens. Visit the historic Shankaracharya Temple." },
      { day: 4, title: "Srinagar to Pahalgam (Valley of Shepherds)", details: "Drive to Pahalgam. Enjoy walks along the Lidder River, visit Betaab Valley, Aru Valley and Chandanwari via local union cabs." },
      { day: 5, title: "Relaxation in Pahalgam", details: "Spend a relaxing day exploring local markets, going pony riding, and taking in the snow-capped mountain scenery." },
      { day: 6, title: "Departure from Srinagar", details: "Transfer to Srinagar airport for your flight back home with fond memories." }
    ]
  },
  {
    id: "p2",
    type: "domestic",
    destination: "Goa",
    title: "Goa Beach Party & Relax Getaway",
    duration: "4 Nights / 5 Days",
    rating: 4.6,
    reviewsCount: 680,
    price: 11499,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    highlights: ["North Goa Beach Hopping", "South Goa Heritage Monuments", "Dolphin Cruise", "Candlelight Dinner"],
    inclusions: ["4 Star Resort", "Daily Breakfast", "Airport Cab Transfers", "Scooter Rent Included"],
    itinerary: [
      { day: 1, title: "Arrive in Goa & Beach Hangout", details: "Check into your beach resort. Spend the evening relaxing on Calangute or Baga beach." },
      { day: 2, title: "North Goa Sightseeing", details: "Visit Fort Aguada, Sinquerim Beach, Condolim, Anjuna and Vagator beaches. Experience water sports at Calangute." },
      { day: 3, title: "South Goa Cultural Tour", details: "Explore Basilica of Bom Jesus, Se Cathedral, Mangueshi Temple and enjoy a late evening sunset cruise on the Mandovi River." },
      { day: 4, title: "Leisure Day / Water Sports", details: "Day at leisure. Opt for scuba diving at Grand Island or rent a scooter to explore hidden cafes." },
      { day: 5, title: "Departure", details: "Check out from resort and transfer to Goa Airport / Railway Station." }
    ]
  },
  {
    id: "p3",
    type: "international",
    destination: "Maldives",
    title: "Luxury Maldives Overwater Villa Dream",
    duration: "4 Nights / 5 Days",
    rating: 4.9,
    reviewsCount: 310,
    price: 64999,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    highlights: ["2 Nights Beach Villa + 2 Nights Water Villa", "Speedboat Airport Transfers", "All-Inclusive Meals & Premium Drinks", "Snorkeling Equipment Rental"],
    inclusions: ["5 Star Luxury Resort", "All meals & drinks", "Speedboat transfers", "Free WiFi"],
    itinerary: [
      { day: 1, title: "Arrival in Male & Speedboat Transfer", details: "Arrive at Velana International Airport. Direct speedboat transfer to your luxury private island resort. Check into your Beach Villa." },
      { day: 2, title: "Snorkeling & Water Activities", details: "Explore the house reef. Swim alongside stingrays, baby sharks, and sea turtles." },
      { day: 3, title: "Upgrade to Overwater Villa", details: "Check out of beach villa and move into your Overwater Villa with direct lagoon access. Enjoy sunset champagne." },
      { day: 4, title: "Spa & Dinner on the Beach", details: "Indulge in a couple's massage at the overwater spa, followed by a romantic private beach dinner under the stars." },
      { day: 5, title: "Return Speedboat to Male", details: "Speedboat transfer back to Male Airport for your onward international flight." }
    ]
  },
  {
    id: "p4",
    type: "international",
    destination: "Switzerland",
    title: "Best of Switzerland Scenic Trains & Alps",
    duration: "6 Nights / 7 Days",
    rating: 4.8,
    reviewsCount: 190,
    price: 125000,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    highlights: ["Swiss Travel Pass 1st Class", "Mount Titlis Rotair Cable Car", "Interlaken Lake Cruise", "Lucerne City Tour"],
    inclusions: ["4 Star Hotels", "Daily Swiss Breakfast", "Mountain Excursions", "Train Passes Included"],
    itinerary: [
      { day: 1, title: "Arrive in Zurich & Travel to Lucerne", details: "Land in Zurich, board the modern Swiss rail directly to Lucerne. Walk across the Chapel Bridge." },
      { day: 2, title: "Mount Titlis Glacier Tour", details: "Take the train to Engelberg and board the revolving Rotair Cable Car to the glacier. Experience the Cliff Walk suspension bridge." },
      { day: 3, title: "Lucerne to Interlaken GoldenPass", details: "Take the panoramic GoldenPass express train across Swiss lakes and meadows to Interlaken." },
      { day: 4, title: "Jungfraujoch - Top of Europe", details: "Cogwheel train excursion to the highest railway station in Europe (3,454m). Walk through the Ice Palace." },
      { day: 5, title: "Interlaken to Geneva via Bern", details: "Stop over in Bern (UNESCO Capital) and continue train journey to Geneva by Lake Leman." },
      { day: 6, title: "Geneva City Sightseeing", details: "Visit the Jet d'Eau, United Nations headquarters, and explore Geneva old town." },
      { day: 7, title: "Geneva Airport Departure", details: "Transfer to Geneva airport for flight home." }
    ]
  }
];

export const mockOffers = [
  { id: "o1", title: "FLIGHT DEALS", desc: "Get up to ₹2,500 off on Domestic Flights!", code: "MMTFLIGHT", bg: "linear-gradient(135deg, #2b5876, #4e4376)" },
  { id: "o2", title: "LUXURY HOTELS", desc: "Flat 25% Off on Select 4 & 5 Star Resorts", code: "MMTHOTEL", bg: "linear-gradient(135deg, #11998e, #38ef7d)" },
  { id: "o3", title: "INTERNATIONAL PACKAGES", desc: "Book Maldives & Get Complementary Beach Dinner", code: "MMTISLAND", bg: "linear-gradient(135deg, #ff9966, #ff5e62)" },
  { id: "o4", title: "TRAIN TICKETS", desc: "Zero Service Charge on your 1st Train Booking", code: "MMTTRAIN", bg: "linear-gradient(135deg, #e52d27, #b31217)" },
  { id: "o5", title: "BUS OFFERS", desc: "Flat 10% Off on Sleeper & AC Volvo Buses", code: "MMTBUS", bg: "linear-gradient(135deg, #7F00FF, #E100FF)" }
];
