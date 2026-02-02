export const PROVINCES = [
  "Province 1",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
] as const;

export const DISTRICTS: Record<string, string[]> = {
  "Province 1": [
    "Bhojpur",
    "Dhankuta",
    "Ilam",
    "Jhapa",
    "Khotang",
    "Morang",
    "Okhaldhunga",
    "Panchthar",
    "Sankhuwasabha",
    "Solukhumbu",
    "Sunsari",
    "Taplejung",
    "Terhathum",
    "Udayapur",
  ],
  "Madhesh Province": [
    "Saptari",
    "Siraha",
    "Dhanusha",
    "Mahottari",
    "Sarlahi",
    "Bara",
    "Parsa",
    "Rautahat",
  ],
  "Bagmati Province": [
    "Bhaktapur",
    "Chitwan",
    "Dhading",
    "Dolakha",
    "Kathmandu",
    "Kavrepalanchok",
    "Lalitpur",
    "Makwanpur",
    "Nuwakot",
    "Ramechhap",
    "Rasuwa",
    "Sindhuli",
    "Sindhupalchok",
  ],
  "Gandaki Province": [
    "Baglung",
    "Gorkha",
    "Kaski",
    "Lamjung",
    "Manang",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Parbat",
    "Syangja",
    "Tanahun",
  ],
  "Lumbini Province": [
    "Arghakhanchi",
    "Banke",
    "Bardiya",
    "Dang",
    "Eastern Rukum",
    "Gulmi",
    "Kapilvastu",
    "Palpa",
    "Parasi",
    "Pyuthan",
    "Rolpa",
    "Rupandehi",
  ],
  "Karnali Province": [
    "Dailekh",
    "Dolpa",
    "Humla",
    "Jajarkot",
    "Jumla",
    "Kalikot",
    "Mugu",
    "Salyan",
    "Surkhet",
    "Western Rukum",
  ],
  "Sudurpashchim Province": [
    "Achham",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Dadeldhura",
    "Darchula",
    "Doti",
    "Kailali",
    "Kanchanpur",
  ],
};

export const PAYMENT_PLATFORMS = {
  online: ["eSewa", "Khalti", "IMEPay", "Connect IPS", "FonePay", "Other"],
  banks: [
    "Nepal Bank Limited",
    "Rastriya Banijya Bank",
    "Agriculture Development Bank",
    "Nabil Bank",
    "Nepal Investment Bank",
    "Standard Chartered Bank Nepal",
    "Himalayan Bank",
    "Nepal SBI Bank",
    "Nepal Bangladesh Bank",
    "Everest Bank",
    "Kumari Bank",
    "Laxmi Bank",
    "Citizens Bank International",
    "Prime Commercial Bank",
    "Sunrise Bank",
    "Century Commercial Bank",
    "Sanima Bank",
    "Machhapuchchhre Bank",
    "NIC Asia Bank",
    "Global IME Bank",
    "NMB Bank",
    "Prabhu Bank",
    "Siddhartha Bank",
    "Bank of Kathmandu",
    "Civil Bank",
    "Other",
  ],
} as const;

export const NEPALI_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export const EDUCATION_LEVELS = [
  "SLC/SEE",
  "10+2/Intermediate",
  "Bachelor",
  "Master",
  "Other",
] as const;

export const EDUCATION_BOARDS = [
  "NEB (National Examination Board)",
  "TU (Tribhuvan University)",
  "KU (Kathmandu University)",
  "PU (Pokhara University)",
  "PU (Purbanchal University)",
  "FWU (Far Western University)",
  "MU (Mid Western University)",
  "CTEVT",
  "Other",
] as const;

export const RELATIONS = [
  "Father",
  "Mother",
  "Guardian",
  "Brother",
  "Sister",
  "Uncle",
  "Aunt",
  "Other",
] as const;

export const FEE_TYPES = [
  { value: "admission_fee", label: "Admission Fee" },
  { value: "tuition_fee", label: "Tuition Fee" },
  { value: "exam_fee", label: "Exam Fee" },
  { value: "certificate_fee", label: "Certificate Fee" },
  { value: "other", label: "Other" },
] as const;

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "online", label: "Online Payment" },
  { value: "bank_transfer", label: "Bank Transfer" },
] as const;

// Helper function to get districts by province
export const getDistrictsByProvince = (province: string): string[] => {
  return DISTRICTS[province] || [];
};

// Helper function to format Nepali currency
export const formatNepaliCurrency = (amount: number): string => {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
};

// Helper function to get current fiscal year
export const getCurrentFiscalYear = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // Nepali fiscal year starts in mid-July (Shrawan)
  // If current month is July or later, fiscal year is current/next
  // Otherwise, it's previous/current
  if (currentMonth >= 7) {
    return `${currentYear}/${(currentYear + 1).toString().slice(2)}`;
  } else {
    return `${currentYear - 1}/${currentYear.toString().slice(2)}`;
  }
};

// Helper function to validate Nepali phone number
export const validateNepalPhone = (phone: string): boolean => {
  // Nepali phone numbers: +977-XXXXXXXXXX or 977XXXXXXXXXX or XXXXXXXXXX (10 digits)
  const phoneRegex = /^(\+?977)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ""));
};

// Helper function to format phone number
export const formatNepalPhone = (phone: string): string => {
  const cleaned = phone.replace(/[-\s]/g, "");
  if (cleaned.startsWith("977")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("+977")) {
    return cleaned;
  } else {
    return `+977${cleaned}`;
  }
};
