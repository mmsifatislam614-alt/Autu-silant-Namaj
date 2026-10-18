export interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  divisionBn: string;
  divisionEn: string;
  lat: number;
  lng: number;
}

export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { id: 'gazipur', nameBn: 'গাজীপুর', nameEn: 'Gazipur', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 24.0023, lng: 90.4264 },
  { id: 'narayanganj', nameBn: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.6238, lng: 90.5000 },
  { id: 'narsingdi', nameBn: 'নরসিংদী', nameEn: 'Narsingdi', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.9322, lng: 90.7154 },
  { id: 'manikganj', nameBn: 'মানিকগঞ্জ', nameEn: 'Manikganj', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.8644, lng: 90.0047 },
  { id: 'munshiganj', nameBn: 'মুন্সীগঞ্জ', nameEn: 'Munshiganj', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.5422, lng: 90.5305 },
  { id: 'tangail', nameBn: 'টাঙ্গাইল', nameEn: 'Tangail', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 24.2513, lng: 89.9167 },
  { id: 'kishoreganj', nameBn: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 24.4449, lng: 90.7766 },
  { id: 'faridpur', nameBn: 'ফরিদপুর', nameEn: 'Faridpur', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.6071, lng: 89.8429 },
  { id: 'gopalganj', nameBn: 'গোপালগঞ্জ', nameEn: 'Gopalganj', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.0051, lng: 89.8266 },
  { id: 'madaripur', nameBn: 'মাদারীপুর', nameEn: 'Madaripur', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.1641, lng: 90.1897 },
  { id: 'rajbari', nameBn: 'রাজবাড়ী', nameEn: 'Rajbari', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.7574, lng: 89.6445 },
  { id: 'shariatpur', nameBn: 'শরীয়তপুর', nameEn: 'Shariatpur', divisionBn: 'ঢাকা', divisionEn: 'Dhaka', lat: 23.2423, lng: 90.4348 },

  // Chattogram Division
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 22.3569, lng: 91.7832 },
  { id: 'coxsbazar', nameBn: 'কক্সবাজার', nameEn: "Cox's Bazar", divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 21.4272, lng: 92.0058 },
  { id: 'cumilla', nameBn: 'কুমিল্লা', nameEn: 'Cumilla', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 23.4607, lng: 91.1809 },
  { id: 'feni', nameBn: 'ফেনী', nameEn: 'Feni', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 23.0186, lng: 91.3966 },
  { id: 'brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 23.9571, lng: 91.1119 },
  { id: 'chandpur', nameBn: 'চাঁদপুর', nameEn: 'Chandpur', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 23.2333, lng: 90.6667 },
  { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 22.8696, lng: 91.0994 },
  { id: 'lakshmipur', nameBn: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 22.9425, lng: 90.8412 },
  { id: 'rangamati', nameBn: 'রাঙ্গামাটি', nameEn: 'Rangamati', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 22.7324, lng: 92.2985 },
  { id: 'bandarban', nameBn: 'বান্দরবান', nameEn: 'Bandarban', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 22.1953, lng: 92.2184 },
  { id: 'khagrachhari', nameBn: 'খাগড়াছড়ি', nameEn: 'Khagrachhari', divisionBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', lat: 23.1193, lng: 91.9847 },

  // Sylhet Division
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', divisionBn: 'সিলেট', divisionEn: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { id: 'moulvibazar', nameBn: 'মৌলভীবাজার', nameEn: 'Moulvibazar', divisionBn: 'সিলেট', divisionEn: 'Sylhet', lat: 24.4829, lng: 91.7774 },
  { id: 'habiganj', nameBn: 'হবিগঞ্জ', nameEn: 'Habiganj', divisionBn: 'সিলেট', divisionEn: 'Sylhet', lat: 24.3749, lng: 91.4155 },
  { id: 'sunamganj', nameBn: 'সুনামগঞ্জ', nameEn: 'Sunamganj', divisionBn: 'সিলেট', divisionEn: 'Sylhet', lat: 25.0658, lng: 91.3950 },

  // Rajshahi Division
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogura', divisionBn: 'রাজshahi', divisionEn: 'Rajshahi', lat: 24.8465, lng: 89.3777 },
  { id: 'pabna', nameBn: 'পাবনা', nameEn: 'Pabna', divisionBn: 'রাজshahi', divisionEn: 'Rajshahi', lat: 24.0064, lng: 89.2372 },
  { id: 'sirajganj', nameBn: 'সিরাজগঞ্জ', nameEn: 'Sirajganj', divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', lat: 24.4534, lng: 89.7008 },
  { id: 'naogaon', nameBn: 'নওগাঁ', nameEn: 'Naogaon', divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', lat: 24.7936, lng: 88.9318 },
  { id: 'natore', nameBn: 'নাটোর', nameEn: 'Natore', divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', lat: 24.4206, lng: 88.9324 },
  { id: 'chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapainawabganj', divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', lat: 24.5965, lng: 88.2775 },
  { id: 'joypurhat', nameBn: 'জয়পুরহাট', nameEn: 'Joypurhat', divisionBn: 'রাজশাহী', divisionEn: 'Rajshahi', lat: 25.1015, lng: 89.0270 },

  // Khulna Division
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { id: 'jashore', nameBn: 'যশোর', nameEn: 'Jashore', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.1664, lng: 89.2081 },
  { id: 'kushtia', nameBn: 'কুষ্টিয়া', nameEn: 'Kushtia', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.9013, lng: 89.1205 },
  { id: 'satkhira', nameBn: 'সাতক্ষীরা', nameEn: 'Satkhira', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 22.7185, lng: 89.0705 },
  { id: 'bagerhat', nameBn: 'বাগেরহাট', nameEn: 'Bagerhat', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 22.6516, lng: 89.7859 },
  { id: 'chuadanga', nameBn: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.6402, lng: 88.8418 },
  { id: 'jhenaidah', nameBn: 'ঝিনাইদহ', nameEn: 'Jhenaidah', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.5448, lng: 89.1539 },
  { id: 'magura', nameBn: 'মাগুরা', nameEn: 'Magura', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.4873, lng: 89.4199 },
  { id: 'meherpur', nameBn: 'মেহেরপুর', nameEn: 'Meherpur', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.7622, lng: 88.6318 },
  { id: 'narail', nameBn: 'নড়াইল', nameEn: 'Narail', divisionBn: 'খুলনা', divisionEn: 'Khulna', lat: 23.1725, lng: 89.5127 },

  // Barishal Division
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', divisionBn: 'বরিশাল', divisionEn: 'Barishal', lat: 22.7010, lng: 90.3535 },
  { id: 'bhola', nameBn: 'ভোলা', nameEn: 'Bhola', divisionBn: 'বরিশাল', divisionEn: 'Barishal', lat: 22.6859, lng: 90.6481 },
  { id: 'patuakhali', nameBn: 'পটুয়াখালী', nameEn: 'Patuakhali', divisionBn: 'বরিশাল', divisionEn: 'Barishal', lat: 22.3596, lng: 90.3299 },
  { id: 'pirojpur', nameBn: 'পিরোজপুর', nameEn: 'Pirojpur', divisionBn: 'বরিশাল', divisionEn: 'Barishal', lat: 22.5841, lng: 89.9720 },
  { id: 'barguna', nameBn: 'বরগুনা', nameEn: 'Barguna', divisionBn: 'বরিশাল', divisionEn: 'Barishal', lat: 22.0953, lng: 90.1121 },
  { id: 'jhalokati', nameBn: 'ঝালকাঠি', nameEn: 'Jhalokati', divisionBn: 'বরিশাল', divisionEn: 'Barishal', lat: 22.6406, lng: 90.1987 },

  // Rangpur Division
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 25.7439, lng: 89.2752 },
  { id: 'dinajpur', nameBn: 'দিনাজপুর', nameEn: 'Dinajpur', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 25.6217, lng: 88.6355 },
  { id: 'gaibandha', nameBn: 'গাইবান্ধা', nameEn: 'Gaibandha', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 25.3288, lng: 89.5408 },
  { id: 'kurigram', nameBn: 'কুড়িগ্রাম', nameEn: 'Kurigram', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 25.8054, lng: 89.6362 },
  { id: 'lalmonirhat', nameBn: 'লালমনিরহাট', nameEn: 'Lalmonirhat', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 25.9923, lng: 89.2847 },
  { id: 'nilphamari', nameBn: 'নীলফামারী', nameEn: 'Nilphamari', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 25.9318, lng: 88.8560 },
  { id: 'panchagarh', nameBn: 'পঞ্চগড়', nameEn: 'Panchagarh', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 26.3411, lng: 88.5542 },
  { id: 'thakurgaon', nameBn: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon', divisionBn: 'রংপুর', divisionEn: 'Rangpur', lat: 26.0337, lng: 88.4617 },

  // Mymensingh Division
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
  { id: 'jamalpur', nameBn: 'জামালপুর', nameEn: 'Jamalpur', divisionBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', lat: 24.9375, lng: 89.9378 },
  { id: 'netrokona', nameBn: 'নেত্রকোণা', nameEn: 'Netrokona', divisionBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', lat: 24.8709, lng: 90.7279 },
  { id: 'sherpur', nameBn: 'শেরপুর', nameEn: 'Sherpur', divisionBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', lat: 25.0205, lng: 90.0153 }
];

export const INTERNATIONAL_CITIES: District[] = [
  { id: 'makkah', nameBn: 'মক্কা (সৌদি আরব)', nameEn: 'Makkah, Saudi Arabia', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 21.4225, lng: 39.8262 },
  { id: 'madinah', nameBn: 'মদীনা (সৌদি আরব)', nameEn: 'Madinah, Saudi Arabia', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 24.5247, lng: 39.5692 },
  { id: 'dubai', nameBn: 'দুবাই (ইউএই)', nameEn: 'Dubai, UAE', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 25.2048, lng: 55.2708 },
  { id: 'kualalumpur', nameBn: 'কুয়ালালামপুর (মালয়েশিয়া)', nameEn: 'Kuala Lumpur, Malaysia', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 3.1390, lng: 101.6869 },
  { id: 'london', nameBn: 'লন্ডন (যুক্তরাজ্য)', nameEn: 'London, UK', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 51.5074, lng: -0.1278 },
  { id: 'newyork', nameBn: 'নিউইয়র্ক (যুক্তরাষ্ট্র)', nameEn: 'New York, USA', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 40.7128, lng: -74.0060 },
  { id: 'toronto', nameBn: 'টরন্টো (কানাডা)', nameEn: 'Toronto, Canada', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 43.6532, lng: -79.3832 },
  { id: 'kolkata', nameBn: 'কলকাতা (ভারত)', nameEn: 'Kolkata, India', divisionBn: 'আন্তর্জাতিক', divisionEn: 'International', lat: 22.5726, lng: 88.3639 }
];

export function findClosestDistrict(lat: number, lng: number): District {
  let minDistance = Infinity;
  let closest: District = BANGLADESH_DISTRICTS[0];

  const allPlaces = [...BANGLADESH_DISTRICTS, ...INTERNATIONAL_CITIES];

  for (const place of allPlaces) {
    const dLat = (place.lat - lat) * (Math.PI / 180);
    const dLng = (place.lng - lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(place.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = 6371 * c; // Earth radius in km

    if (dist < minDistance) {
      minDistance = dist;
      closest = place;
    }
  }

  return closest;
}
