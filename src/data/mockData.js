// Realistic mock data for AgroCare AI
export const CROPS_SUPPORTED = [
  { id: 'tomato', name: 'Tomato (ಟೊಮೇಟೊ)', icon: '🍅', family: 'Solanaceae', commonDiseases: ['Early Blight', 'Late Blight', 'Leaf Curl Virus', 'Bacterial Spot'] },
  { id: 'potato', name: 'Potato (ಆಲೂಗಡ್ಡೆ)', icon: '🥔', family: 'Solanaceae', commonDiseases: ['Late Blight', 'Early Blight', 'Black Scurf'] },
  { id: 'corn', name: 'Maize / Corn (ಮೆಕ್ಕೆಜೋಳ)', icon: '🌽', family: 'Poaceae', commonDiseases: ['Southern Corn Leaf Blight', 'Common Rust', 'Turcicum Leaf Blight'] },
  { id: 'rice', name: 'Rice / Paddy (ಭತ್ತ)', icon: '🌾', family: 'Poaceae', commonDiseases: ['Blast', 'Brown Spot', 'Bacterial Blight', 'Sheath Blight'] },
  { id: 'cotton', name: 'Cotton (ಹತ್ತಿ)', icon: '🌱', family: 'Malvaceae', commonDiseases: ['Bacterial Blight', 'Grey Mildew', 'Leaf Curl'] },
  { id: 'chilli', name: 'Chilli (ಮೆಣಸಿನಕಾಯಿ)', icon: '🌶️', family: 'Solanaceae', commonDiseases: ['Anthracnose / Die Back', 'Powdery Mildew', 'Chilli Vein Banding'] },
  { id: 'wheat', name: 'Wheat (ಗೋಧಿ)', icon: '🌾', family: 'Poaceae', commonDiseases: ['Stripe Rust', 'Powdery Mildew', 'Spot Blotch'] },
  { id: 'sugarcane', name: 'Sugarcane (ಕಬ್ಬು)', icon: '🎋', family: 'Poaceae', commonDiseases: ['Red Rot', 'Smut', 'Rust'] },
  { id: 'arecanut', name: 'Arecanut (ಅಡಿಕೆ)', icon: '🟤', family: 'Arecaceae', commonDiseases: ['Koleroga / Mahali', 'Yellow Leaf Disease'] },
  { id: 'coconut', name: 'Coconut (ತೆಂಗು)', icon: '🥥', family: 'Arecaceae', commonDiseases: ['Bud Rot', 'Root Wilt'] },
  { id: 'coffee', name: 'Coffee (ಕಾಫಿ)', icon: '☕', family: 'Rubiaceae', commonDiseases: ['Leaf Rust', 'Black Rot'] },
  { id: 'tea', name: 'Tea (ಚಹಾ)', icon: '🍵', family: 'Theaceae', commonDiseases: ['Blister Blight', 'Grey Blight'] },
];

export const SAMPLE_DISEASE_PRESETS = [
  {
    id: 'sample-early-blight',
    crop: 'Tomato',
    cropId: 'tomato',
    disease: 'Tomato Early Blight',
    pathogen: 'Fungus (Alternaria solani)',
    pathogenType: 'Fungal',
    confidence: 96.8,
    severity: 'Moderate',
    severityPercent: 38,
    affectedArea: '38% leaf surface with concentric target-ring necrosis',
    urgency: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
    gradCamUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
    symptoms: [
      'Dark brown to black necrotic spots with concentric rings ("target board" pattern)',
      'Yellow chlorotic halo surrounding lesions',
      'Lower foliage showing senescence and premature dropping',
      'Stem lesions dark and slightly sunken at base'
    ],
    riskFactor: 'High risk of aerial spore dispersal under forecasted night humidity >85%',
    culturalControl: [
      'Immediately prune and incinerate infected lower foliage (do not compost)',
      'Water at the base of the plant only; avoid overhead sprinkler irrigation',
      'Ensure 60cm row spacing to maximize canopy ventilation and drying'
    ],
    biologicalControl: [
      'Foliar spray of Trichoderma viride @ 5g/L or Pseudomonas fluorescens @ 10g/L',
      'Apply cold-pressed Neem Seed Kernel Extract (NSKE 5%) as preventive barrier'
    ],
    chemicalControl: [
      'Mancozeb 75% WP @ 2.0g/L water (Protective contact fungicide)',
      'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0ml/L (Systemic curative if disease has spread >20%)'
    ],
    dosagePer15L: '30g Mancozeb in 15L water tank',
    safetyNotes: [
      'Wear rubber gloves and mask during spray preparation',
      'Pre-Harvest Interval (PHI): 7 days',
      'Re-entry Interval (REI): 24 hours'
    ]
  },
  {
    id: 'sample-potato-late-blight',
    crop: 'Potato',
    cropId: 'potato',
    disease: 'Potato Late Blight',
    pathogen: 'Oomycete (Phytophthora infestans)',
    pathogenType: 'Oomycete / Fungal',
    confidence: 98.4,
    severity: 'Severe',
    severityPercent: 62,
    affectedArea: '62% foliage water-soaked with active white sporulation',
    urgency: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=800&q=80',
    gradCamUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=800&q=80',
    symptoms: [
      'Water-soaked pale green or dark necrotic patches appearing near leaf tips',
      'Delicate white fungal mycelial growth visible on leaf undersides in morning dew',
      'Rapid petiole collapse and dark brown lesion expansion in humid conditions'
    ],
    riskFactor: 'Extremely aggressive pathogen: capable of destroying entire field in 7-10 days if unchecked',
    culturalControl: [
      'Cease all overhead watering immediately',
      'Hill up potato ridges to cover tubers and prevent downward spore wash'
    ],
    biologicalControl: [
      'Bio-formulation of Bacillus subtilis @ 5ml/L on unaffected adjacent rows'
    ],
    chemicalControl: [
      'Dimethomorph 50% WP @ 1g/L + Mancozeb @ 2g/L tank-mix for fast eradication',
      'Cymoxanil 8% + Mancozeb 64% WP @ 2.5g/L'
    ],
    dosagePer15L: '37.5g Cymoxanil+Mancozeb in 15L sprayer',
    safetyNotes: [
      'Do not apply directly prior to rainfall (needs 2 hours rain-fast period)',
      'PHI: 14 days before harvest'
    ]
  },
  {
    id: 'sample-corn-blight',
    crop: 'Maize / Corn',
    cropId: 'corn',
    disease: 'Southern Corn Leaf Blight',
    pathogen: 'Fungus (Bipolaris maydis)',
    pathogenType: 'Fungal',
    confidence: 94.1,
    severity: 'Mild',
    severityPercent: 18,
    affectedArea: '18% lower canopy elliptical lesions',
    urgency: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    gradCamUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    symptoms: [
      'Small, elongated elliptical lesions with tan centers and reddish borders',
      'Parallel lesion alignment along leaf veins'
    ],
    riskFactor: 'Moderate: manageable with prompt single protective spray',
    culturalControl: ['Crop rotation with non-host legume next season'],
    biologicalControl: ['Trichoderma harzianum @ 5g/L soil drench'],
    chemicalControl: ['Propiconazole 25% EC @ 1ml/L water'],
    dosagePer15L: '15ml in 15L water sprayer',
    safetyNotes: ['Spray in early morning before 9 AM']
  }
];

export const INITIAL_CASES = [
  {
    id: 'AGC-2026-8841',
    farmerName: 'Ramesh Gowda',
    crop: 'Tomato',
    variety: 'Arka Rakshak (F1)',
    field: 'Plot A - North Terrace (1.2 Acres)',
    disease: 'Tomato Early Blight',
    pathogen: 'Alternaria solani',
    severity: 'Moderate',
    severityPercent: 38,
    status: 'In Recovery', // Active | In Recovery | Resolved | Expert Review
    confidence: 96.8,
    dateCreated: '2026-10-24',
    lastUpdate: '2026-10-30',
    nextFollowUp: '2026-11-03',
    followUpDueDays: 3,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { day: 'Day 0 (Oct 24)', label: 'Initial AI Scan', severity: 38, status: 'Active', note: 'AI confirmed Alternaria solani at 96.8% confidence. Treatment initiated.' },
      { day: 'Day 4 (Oct 28)', label: 'First Treatment Follow-up', severity: 26, status: 'In Recovery', note: 'Mancozeb 75% WP applied. Necrotic halo stabilized, no new spots on upper canopy.' },
      { day: 'Day 7 (Oct 31)', label: 'Current Status', severity: 16, status: 'In Recovery', note: 'Lesions dried and corked. Vigorous new top flush visible.' }
    ],
    recoveryHistory: [
      { day: 'Day 0', severity: 38, healthyPercent: 62 },
      { day: 'Day 2', severity: 34, healthyPercent: 66 },
      { day: 'Day 4', severity: 26, healthyPercent: 74 },
      { day: 'Day 6', severity: 20, healthyPercent: 80 },
      { day: 'Day 7', severity: 16, healthyPercent: 84 },
    ],
    followUpImages: [
      { date: 'Oct 24 (Day 0)', url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=400&q=80', severity: 38, note: 'Initial severe leaf spots' },
      { date: 'Oct 28 (Day 4)', url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80', severity: 26, note: 'Halo dried out' },
      { date: 'Oct 31 (Day 7)', url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=400&q=80', severity: 16, note: 'Significant foliage healing' },
    ],
    treatmentLogs: [
      { date: '2026-10-25', action: 'Pruning of 18 infected lower leaves across row 1-4', type: 'Cultural' },
      { date: '2026-10-26', action: 'Mancozeb 75% WP spray @ 2g/L (Total 45L applied)', type: 'Chemical' },
      { date: '2026-10-29', action: 'Neem Oil 10,000 ppm preventive perimeter barrier', type: 'Biological' }
    ],
    chatMessages: [
      {
        id: 1,
        sender: 'ai',
        time: 'Oct 24, 10:14 AM',
        text: 'Hello Ramesh! I have diagnosed Tomato Early Blight with 96.8% confidence on your Arka Rakshak crop. I have prepared your customized recovery protocol. Would you like to review immediate steps?'
      },
      {
        id: 2,
        sender: 'farmer',
        time: 'Oct 24, 10:18 AM',
        text: 'Should I spray Mancozeb today? Rain is predicted tonight in Mandya.'
      },
      {
        id: 3,
        sender: 'ai',
        time: 'Oct 24, 10:19 AM',
        text: 'Hold off on spraying until tomorrow morning at 7:00 AM! Mancozeb needs at least 2-3 hours of dry sunlight to adhere to the leaf cuticle and create a rain-fast barrier. Prune the heavily spotted lower leaves today instead to reduce fungal inoculum.',
        citations: ['ICAR Indian Institute of Horticultural Research (IIHR) Advisory 2026']
      }
    ],
    expertReview: {
      required: false,
      reviewedBy: 'Dr. Ramesh Kumar, Ph.D (Plant Pathology, UAS Bangalore)',
      status: 'Approved',
      date: '2026-10-25',
      note: 'Diagnosis fully accurate. Recommended dosage and timing are sound.'
    }
  },
  {
    id: 'AGC-2026-9024',
    farmerName: 'Ramesh Gowda',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    field: 'Plot B - South Hill (0.8 Acres)',
    disease: 'Potato Late Blight',
    pathogen: 'Phytophthora infestans',
    severity: 'Severe',
    severityPercent: 62,
    status: 'Active',
    confidence: 98.4,
    dateCreated: '2026-10-29',
    lastUpdate: '2026-10-30',
    nextFollowUp: '2026-11-01',
    followUpDueDays: 1,
    imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { day: 'Day 0 (Oct 29)', label: 'Emergency Scan', severity: 62, status: 'Active', note: 'Severe late blight detected with water-soaking. High risk.' }
    ],
    recoveryHistory: [
      { day: 'Day 0', severity: 62, healthyPercent: 38 },
      { day: 'Day 2', severity: 58, healthyPercent: 42 }
    ],
    followUpImages: [
      { date: 'Oct 29 (Day 0)', url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=400&q=80', severity: 62, note: 'Water-soaked necrosis' }
    ],
    treatmentLogs: [
      { date: '2026-10-30', action: 'Curative spray Cymoxanil + Mancozeb tank mix', type: 'Chemical' }
    ],
    chatMessages: [
      {
        id: 1,
        sender: 'ai',
        time: 'Oct 29, 03:40 PM',
        text: 'ALERT: Potato Late Blight is aggressive in current high humidity (91%). Please apply curative systemic fungicide within 24 hours to protect tubers.'
      }
    ],
    expertReview: {
      required: true,
      reviewedBy: 'Pending Agronomist Assignment',
      status: 'In Review',
      date: '2026-10-30',
      note: 'Awaiting expert sign-off on tuber safety protocol.'
    }
  },
  {
    id: 'AGC-2026-7512',
    farmerName: 'Ramesh Gowda',
    crop: 'Maize / Corn',
    variety: 'Pioneer 3396',
    field: 'Field C - River Bank (2.5 Acres)',
    disease: 'Southern Corn Leaf Blight',
    pathogen: 'Bipolaris maydis',
    severity: 'Mild',
    severityPercent: 12,
    status: 'Resolved',
    confidence: 94.1,
    dateCreated: '2026-10-10',
    lastUpdate: '2026-10-24',
    nextFollowUp: 'Completed',
    followUpDueDays: 0,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    timeline: [
      { day: 'Day 0', label: 'Detection', severity: 18, status: 'Active', note: 'Early elliptical spots.' },
      { day: 'Day 7', label: 'Mid-term check', severity: 6, status: 'In Recovery', note: 'Propiconazole arrested lesion spread.' },
      { day: 'Day 14', label: 'Case Closed', severity: 0, status: 'Resolved', note: 'Full recovery, foliage healthy.' }
    ],
    recoveryHistory: [
      { day: 'Day 0', severity: 18, healthyPercent: 82 },
      { day: 'Day 4', severity: 12, healthyPercent: 88 },
      { day: 'Day 7', severity: 6, healthyPercent: 94 },
      { day: 'Day 14', severity: 0, healthyPercent: 100 }
    ],
    followUpImages: [
      { date: 'Oct 10 (Day 0)', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80', severity: 18, note: 'Initial lesions' },
      { date: 'Oct 24 (Day 14)', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80', severity: 0, note: 'Full healthy canopy' }
    ],
    treatmentLogs: [
      { date: '2026-10-11', action: 'Propiconazole 25% EC spray @ 1ml/L', type: 'Chemical' }
    ],
    chatMessages: [
      { id: 1, sender: 'ai', time: 'Oct 24, 05:00 PM', text: 'Congratulations! Case AGC-2026-7512 is now marked 100% recovered and resolved.' }
    ],
    expertReview: {
      required: false,
      reviewedBy: 'Auto-verified',
      status: 'Approved',
      date: '2026-10-24',
      note: 'Lesions completely cleared.'
    }
  }
];

export const WEATHER_DATA = {
  location: 'Mandya, Karnataka',
  temp: 28,
  tempMin: 21,
  tempMax: 31,
  condition: 'Partly Cloudy',
  humidity: 68,
  windSpeed: '9 km/h NE',
  rainfallProbability: 15,
  sprayWindowStatus: 'Optimal Window', // Optimal | Caution | Unfavorable
  sprayWindowAdvice: 'Next 6 hours are ideal for foliar fungicide application. Light wind < 10 km/h ensures minimal spray drift.',
  forecast: [
    { day: 'Today', temp: '28° / 21°', icon: '⛅', risk: 'Medium', advice: 'Good for spraying' },
    { day: 'Tomorrow', temp: '27° / 22°', icon: '🌧️', risk: 'High', advice: 'Evening showers: avoid spray after 2 PM' },
    { day: 'Sun', temp: '29° / 20°', icon: '☀️', risk: 'Low', advice: 'Sunny & dry: excellent recovery weather' },
    { day: 'Mon', temp: '30° / 21°', icon: '☀️', risk: 'Low', advice: 'Ideal for follow-up observation' },
  ],
  diseaseRiskAlert: {
    level: 'Warning',
    title: 'High Fungal Spore Risk in Mandya Region',
    description: 'Extended night humidity (>85%) over next 48 hours strongly favors Early Blight and Downy Mildew propagation on Solanaceous crops.'
  }
};

export const VERIFIED_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Indofil M-45 (Mancozeb 75% WP)',
    category: 'Contact Fungicide',
    type: 'Chemical',
    activeIngredient: 'Mancozeb 75% WP',
    cibNumber: 'CIR-21904/95-Mancozeb(WP)-114',
    rating: 4.8,
    reviewsCount: 342,
    targetDiseases: ['Early Blight', 'Late Blight', 'Leaf Spot', 'Blast'],
    price: '₹340 / 500g',
    dosage: '2.0g - 2.5g per Liter of water',
    safetyTag: 'Green Triangle (Caution)',
    seller: 'Mahalaxmi Agro Center, Mandya (2.1 km away)',
    inStock: true
  },
  {
    id: 'prod-2',
    name: 'Amistar Top (Azoxystrobin + Difenoconazole)',
    category: 'Broad-Spectrum Systemic Fungicide',
    type: 'Chemical',
    activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    cibNumber: 'CIR-43210/2012-Syngenta',
    rating: 4.9,
    reviewsCount: 512,
    targetDiseases: ['Early Blight', 'Powdery Mildew', 'Anthracnose'],
    price: '₹890 / 200ml',
    dosage: '1.0ml per Liter of water',
    safetyTag: 'Blue Triangle (Danger)',
    seller: 'Kisan Seva Kendra, Mysore Road (3.8 km away)',
    inStock: true
  },
  {
    id: 'prod-3',
    name: 'EcoTricho (Trichoderma viride 1.5% WP)',
    category: 'Bio-Fungicide & Root Innoculant',
    type: 'Organic / Bio',
    activeIngredient: 'Trichoderma viride 2x10^6 CFU/g',
    cibNumber: 'CIB-Bio-Organic-9011',
    rating: 4.7,
    reviewsCount: 189,
    targetDiseases: ['Damping Off', 'Root Rot', 'Soil-borne Blight'],
    price: '₹180 / 1kg',
    dosage: '5g - 10g per Liter of water',
    safetyTag: 'Bio Certified (Safe for pollinators)',
    seller: 'Krishi Vigyan Kendra Depot (4.5 km away)',
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'NeemGold Super (Azadirachtin 10,000 PPM)',
    category: 'Botanical Antifeedant & Fungistat',
    type: 'Organic',
    activeIngredient: 'Cold-pressed Azadirachtin 1% EC',
    cibNumber: 'CIB-Botanical-4412',
    rating: 4.6,
    reviewsCount: 220,
    targetDiseases: ['Leaf Curl Whitefly vector', 'Early fungal sporulation'],
    price: '₹420 / 500ml',
    dosage: '3.0ml per Liter of water',
    safetyTag: '100% Organic Eco-Safe',
    seller: 'Green Earth Organics, Mandya (1.9 km away)',
    inStock: true
  }
];

export const NEARBY_AGRI_SHOPS = [
  {
    id: 'shop-1',
    name: 'Mahalaxmi Krishi Seva Kendra',
    proprietor: 'B. Suresh Patel',
    phone: '+91 98451 22390',
    address: 'Near Old Bus Stand, B.H. Road, Mandya',
    distance: '2.1 km',
    openStatus: 'Open now (Closes 8:00 PM)',
    verified: true,
    availableBrands: ['Indofil', 'Bayer', 'Syngenta', 'UPL', 'Coromandel'],
    rating: 4.8
  },
  {
    id: 'shop-2',
    name: 'Kisan Bandhu Agro Agencies',
    proprietor: 'H. Manjunath',
    phone: '+91 94482 10934',
    address: 'Opposite APMC Market Yard, Mandya',
    distance: '3.5 km',
    openStatus: 'Open now (Closes 7:30 PM)',
    verified: true,
    availableBrands: ['Dhanuka', 'Rallis India', 'Tata Chemicals'],
    rating: 4.6
  },
  {
    id: 'shop-3',
    name: 'Mandya District Co-Operative Bio Depot',
    proprietor: 'Dept of Agriculture, Govt of Karnataka',
    phone: '+91 8232 220199',
    address: 'V.V. Nagar, Near Taluk Office, Mandya',
    distance: '4.2 km',
    openStatus: 'Open (Subsidized seeds & bio-fertilizers)',
    verified: true,
    availableBrands: ['KAU Bio', 'IARI Pusa', 'Karnataka Bio-Agri'],
    rating: 4.9
  }
];

export const NOTIFICATIONS_LIST = [
  {
    id: 'notif-1',
    type: 'follow-up',
    title: 'Follow-up Due: Tomato Early Blight',
    description: 'Case AGC-2026-8841 is scheduled for Day 8 photo inspection. Upload a new leaf photo to check recovery percentage.',
    time: '2 hours ago',
    unread: true,
    caseId: 'AGC-2026-8841',
    actionText: 'Upload Follow-up'
  },
  {
    id: 'notif-2',
    type: 'weather-alert',
    title: 'Rain Alert: Optimal Spraying Ends in 4 Hours',
    description: 'Monsoon cloud band entering Mandya district. Apply protective spray before 2:00 PM today.',
    time: '5 hours ago',
    unread: true,
    caseId: null,
    actionText: 'Check Weather'
  },
  {
    id: 'notif-3',
    type: 'expert-review',
    title: 'Agronomist Verified Your Treatment Plan',
    description: 'Dr. Ramesh Kumar reviewed your Case AGC-2026-8841 and approved Mancozeb spray with 1 minor adjustment.',
    time: '1 day ago',
    unread: false,
    caseId: 'AGC-2026-8841',
    actionText: 'View Doctor Note'
  },
  {
    id: 'notif-4',
    type: 'case-healed',
    title: 'Crop Recovery Milestone Achieved',
    description: 'Maize Blight Case AGC-2026-7512 reached 100% healed status and was successfully closed.',
    time: '3 days ago',
    unread: false,
    caseId: 'AGC-2026-7512',
    actionText: 'View Timeline'
  }
];

export const EXPERT_QUEUE = [
  {
    caseId: 'AGC-2026-9024',
    farmerName: 'Ramesh Gowda',
    crop: 'Potato',
    predictedDisease: 'Potato Late Blight',
    confidence: 68.2, // Low confidence flag
    severity: 'Severe (62%)',
    submittedAt: '2026-10-30 14:20',
    reasonForReview: 'AI Confidence below 70% threshold + High Risk of tuber rot',
    farmerNotes: 'Rapid leaf darkening after heavy overnight rain. Neighbor had late blight last week.'
  },
  {
    caseId: 'AGC-2026-9118',
    farmerName: 'Basavaraj K',
    crop: 'Cotton',
    predictedDisease: 'Bacterial Blight / Angular Leaf Spot',
    confidence: 72.4,
    severity: 'Moderate (44%)',
    submittedAt: '2026-10-30 16:45',
    reasonForReview: 'Farmer requested second opinion on organic copper spray compatibility.',
    farmerNotes: 'Leaves showing water-soaked angular spots between leaf veins.'
  }
];
