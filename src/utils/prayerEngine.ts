/**
 * Offline Astronomical Prayer Times & Qibla Engine
 * Works 100% offline without any server or external API
 */

export interface PrayerTimeConfig {
  fajrAngle: number; // e.g. 18 for Karachi/Bangladesh Islamic Foundation
  ishaAngle: number; // e.g. 18
  asrMethod: 'hanafi' | 'standard'; // standard = Shafi'i/Maliki/Hanbali (shadow ratio 1), hanafi (shadow ratio 2)
  highLatitudeRule: 'middleOfTheNight' | 'seventhOfTheNight' | 'angleBased';
}

export const DEFAULT_CONFIG: PrayerTimeConfig = {
  fajrAngle: 18, // Islamic Foundation Bangladesh / Karachi Standard
  ishaAngle: 18,
  asrMethod: 'hanafi', // Most widely followed in Bangladesh & South Asia
  highLatitudeRule: 'middleOfTheNight',
};

export interface PrayerTimes {
  imsak: Date;
  fajr: Date;
  sunrise: Date;
  ishraq: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
  midnight: Date;
  tahajjudEnd: Date;
  forbiddenTimes: {
    sunrise: { start: Date; end: Date; labelBn: string };
    zawal: { start: Date; end: Date; labelBn: string };
    sunset: { start: Date; end: Date; labelBn: string };
  };
}

export interface WaqtInfo {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameBn: string;
  nameEn: string;
  nameAr: string;
  rakatBn: string;
  time: Date;
  isPrayer: boolean; // false for sunrise
}

// Convert degrees to radians and vice versa
const d2r = (deg: number) => (deg * Math.PI) / 180.0;
const r2d = (rad: number) => (rad * 180.0) / Math.PI;

// Normalize hours to [0, 24)
const fixHour = (h: number): number => {
  h = h - 24.0 * Math.floor(h / 24.0);
  return h < 0 ? h + 24.0 : h;
};

// Normalize angle to [0, 360)
const fixAngle = (a: number): number => {
  a = a - 360.0 * Math.floor(a / 360.0);
  return a < 0 ? a + 360.0 : a;
};

// Calculate Julian Date
function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

// Solar coordinates
function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(d2r(g)) + 0.02 * Math.sin(d2r(2 * g)));
  const e = 23.439 - 0.00000036 * D;

  const RA = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(L)), Math.cos(d2r(L)))) / 15.0;
  const declination = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(L))));
  const eqt = q / 15.0 - fixHour(RA);

  return { declination, eqt };
}

// Compute prayer times for given coordinates and date
export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  config: PrayerTimeConfig = DEFAULT_CONFIG
): PrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = julianDate(year, month, day);
  const { declination, eqt } = sunPosition(jd);

  // Timezone offset in hours (e.g. +6 for Bangladesh)
  // We use the date object's local timezone offset or derive from coordinates
  const timezoneOffset = -date.getTimezoneOffset() / 60;

  // Solar noon
  const noon = fixHour(12 + timezoneOffset - lng / 15 - eqt);

  // Helper to calculate time for a specific sun angle below horizon
  const sunAngleTime = (angle: number, direction: 'ccw' | 'cw'): number => {
    const cosH =
      (Math.sin(d2r(-angle)) - Math.sin(d2r(lat)) * Math.sin(d2r(declination))) /
      (Math.cos(d2r(lat)) * Math.cos(d2r(declination)));

    if (cosH > 1) return direction === 'ccw' ? 0 : 24; // Sun never rises
    if (cosH < -1) return direction === 'ccw' ? 24 : 0; // Sun never sets

    const H = r2d(Math.acos(cosH)) / 15.0;
    return fixHour(noon + (direction === 'ccw' ? -H : H));
  };

  // Asr shadow time
  const asrShadowRatio = config.asrMethod === 'hanafi' ? 2 : 1;
  const asrAngle = -r2d(
    Math.atan(1.0 / (asrShadowRatio + Math.tan(d2r(Math.abs(lat - declination)))))
  );
  const asrTime = noon + (r2d(
    Math.acos(
      (Math.sin(d2r(-asrAngle)) - Math.sin(d2r(lat)) * Math.sin(d2r(declination))) /
        (Math.cos(d2r(lat)) * Math.cos(d2r(declination)))
    )
  ) / 15.0);

  // Standard angles
  const fajrHour = sunAngleTime(config.fajrAngle, 'ccw');
  const sunriseHour = sunAngleTime(0.833, 'ccw');
  const sunsetHour = sunAngleTime(0.833, 'cw');
  const maghribHour = sunsetHour + 2 / 60; // 2-3 mins safety margin after sunset
  const ishaHour = sunAngleTime(config.ishaAngle, 'cw');

  // Helper to create Date object for calculated decimal hour
  const makeDate = (hourDec: number): Date => {
    const d = new Date(date);
    const hrs = Math.floor(hourDec);
    const mins = Math.floor((hourDec - hrs) * 60);
    const secs = Math.floor(((hourDec - hrs) * 60 - mins) * 60);
    d.setHours(hrs, mins, secs, 0);
    return d;
  };

  const fajrDate = makeDate(fajrHour);
  const sunriseDate = makeDate(sunriseHour);
  const ishraqDate = new Date(sunriseDate.getTime() + 18 * 60 * 1000); // 18 mins after sunrise
  const dhuhrDate = makeDate(noon);
  const asrDate = makeDate(asrTime);
  const sunsetDate = makeDate(sunsetHour);
  const maghribDate = makeDate(maghribHour);
  const ishaDate = makeDate(ishaHour);

  // Imsak / Sahri end: 10 mins before Fajr
  const imsakDate = new Date(fajrDate.getTime() - 10 * 60 * 1000);

  // Islamic Midnight (midway between sunset and next sunrise approx)
  const midnightDate = new Date(sunsetDate.getTime() + (sunriseDate.getTime() + 24 * 3600000 - sunsetDate.getTime()) / 2);

  // Tahajjud optimal window: last 1/3 of the night
  const nightLength = (sunriseDate.getTime() + 24 * 3600000 - sunsetDate.getTime());
  const tahajjudEndDate = new Date(fajrDate.getTime() - 15 * 60 * 1000);

  // Forbidden prayer times (তিন নিষিদ্ধ সময়)
  const forbiddenTimes = {
    sunrise: {
      start: sunriseDate,
      end: ishraqDate,
      labelBn: 'সূর্যোদয় (১৫-২০ মিনিট পর্যন্ত নফল নামাজ নিষিদ্ধ)',
    },
    zawal: {
      start: new Date(dhuhrDate.getTime() - 8 * 60 * 1000),
      end: dhuhrDate,
      labelBn: 'দ্বিপ্রহর / খাড়া সূর্য (জোহরের পূর্বে ৮ মিনিট)',
    },
    sunset: {
      start: new Date(sunsetDate.getTime() - 15 * 60 * 1000),
      end: sunsetDate,
      labelBn: 'সূর্যাস্ত (মাগরিবের পূর্বের ১৫ মিনিট)',
    },
  };

  return {
    imsak: imsakDate,
    fajr: fajrDate,
    sunrise: sunriseDate,
    ishraq: ishraqDate,
    dhuhr: dhuhrDate,
    asr: asrDate,
    sunset: sunsetDate,
    maghrib: maghribDate,
    isha: ishaDate,
    midnight: midnightDate,
    tahajjudEnd: tahajjudEndDate,
    forbiddenTimes,
  };
}

// Convert English numbers to Bengali digits
export function toBengaliNumber(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

// Format time in 12-hour Bengali format (e.g. "০৪:২৫ ভোর", "১২:১৫ দুপুর")
export function formatTimeBengali(date: Date, includePeriod = true): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';

  let periodBn = '';
  if (hours >= 3 && hours < 6) periodBn = 'ভোর';
  else if (hours >= 6 && hours < 12) periodBn = 'সকাল';
  else if (hours >= 12 && hours < 15) periodBn = 'দুপুর';
  else if (hours >= 15 && hours < 18) periodBn = 'বিকাল';
  else if (hours >= 18 && hours < 20) periodBn = 'সন্ধ্যা';
  else periodBn = 'রাত';

  hours = hours % 12 || 12;
  const hoursStr = toBengaliNumber(hours < 10 ? '0' + hours : hours);
  const minsStr = toBengaliNumber(minutes < 10 ? '0' + minutes : minutes);

  if (!includePeriod) {
    return `${hoursStr}:${minsStr}`;
  }
  return `${hoursStr}:${minsStr} ${periodBn}`;
}

export function formatTimeEnglish(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hrsStr = hours < 10 ? '0' + hours : hours;
  const minsStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hrsStr}:${minsStr} ${period}`;
}

// Calculate Qibla Direction (Bearing in degrees clockwise from True North)
// Kaaba coordinates: lat 21.4225, lng 39.8262
export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const dLng = d2r(kaabaLng - userLng);
  const phi1 = d2r(userLat);
  const phi2 = d2r(kaabaLat);

  const y = Math.sin(dLng);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLng);

  let qibla = r2d(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

// Offline Hijri Date calculation (Kuwaiti algorithm)
export function getHijriDate(date: Date, adjustmentDays = 0): { day: number; monthNameBn: string; monthNameAr: string; year: number } {
  const adjusted = new Date(date.getTime() + adjustmentDays * 86400000);
  const day = adjusted.getDate();
  const month = adjusted.getMonth();
  const year = adjusted.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = jd + 1 + a - Math.floor(a / 4);
  } else {
    b = jd;
  }

  const bb = b + 1524;
  const cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);
  const iDay = bb - dd - Math.floor(30.6001 * ee);

  let iMonth = ee - 1;
  if (ee > 13) {
    cc + 1;
    iMonth = ee - 13;
  }
  let iYear = cc - 4716;
  if (iMonth < 3) iYear += 1;

  const wd = Math.floor(jd + 1.5) % 7;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const ll = l - 10631 * n + 354;
  const j = (Math.floor((10985 - ll) / 5316)) * (Math.floor((50 * ll) / 17719)) + (Math.floor(ll / 5670)) * (Math.floor((43 * ll) / 15238));
  const lll = ll - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hMonth = Math.floor((24 * lll) / 709);
  const hDay = lll - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  const hijriMonthsBn = [
    'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি',
    'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ্জ'
  ];

  const hijriMonthsAr = [
    'المحرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const validMonth = Math.max(0, Math.min(11, hMonth - 1));

  return {
    day: hDay,
    monthNameBn: hijriMonthsBn[validMonth],
    monthNameAr: hijriMonthsAr[validMonth],
    year: hYear,
  };
}

export function getCurrentAndNextWaqt(times: PrayerTimes, now: Date = new Date()) {
  const currentMillis = now.getTime();

  const list: { id: WaqtInfo['id']; nameBn: string; nameEn: string; nameAr: string; rakatBn: string; time: Date; isPrayer: boolean }[] = [
    { id: 'fajr', nameBn: 'ফজর', nameEn: 'Fajr', nameAr: 'الفجر', rakatBn: '৪ রাকাত (২ সুন্নত + ২ ফরজ)', time: times.fajr, isPrayer: true },
    { id: 'sunrise', nameBn: 'সূর্যোদয়', nameEn: 'Sunrise', nameAr: 'الشروق', rakatBn: 'নিষিদ্ধ সময় শুরু', time: times.sunrise, isPrayer: false },
    { id: 'dhuhr', nameBn: 'যোহর', nameEn: 'Dhuhr', nameAr: 'الظهر', rakatBn: '১২ রাকাত (৪ সুন্নত + ৪ ফরজ + ২ সুন্নত + ২ নফল)', time: times.dhuhr, isPrayer: true },
    { id: 'asr', nameBn: 'আসর', nameEn: 'Asr', nameAr: 'العصر', rakatBn: '৮ রাকাত (৪ সুন্নত + ৪ ফরজ)', time: times.asr, isPrayer: true },
    { id: 'maghrib', nameBn: 'মাগরিব', nameEn: 'Maghrib', nameAr: 'المغرب', rakatBn: '৭ রাকাত (৩ ফরজ + ২ সুন্নত + ২ নফল)', time: times.maghrib, isPrayer: true },
    { id: 'isha', nameBn: 'এশা', nameEn: 'Isha', nameAr: 'العشاء', rakatBn: '১৭ রাকাত (৪ সুন্নত + ৪ ফরজ + ২ সুন্নত + ২ নফল + ৩ বিতর + ২ নফল)', time: times.isha, isPrayer: true },
  ];

  let currentWaqt = list[list.length - 1]; // default Isha of previous day
  let nextWaqt = list[0]; // Fajr

  for (let i = 0; i < list.length; i++) {
    if (currentMillis < list[i].time.getTime()) {
      nextWaqt = list[i];
      currentWaqt = i === 0 ? list[list.length - 1] : list[i - 1];
      break;
    }
  }

  // If time is after Isha
  if (currentMillis >= times.isha.getTime()) {
    currentWaqt = list[list.length - 1];
    // Next waqt is tomorrow's Fajr
    const tomorrowFajr = new Date(times.fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    nextWaqt = { ...list[0], time: tomorrowFajr };
  }

  // Calculate remaining time
  const remainingMillis = Math.max(0, nextWaqt.time.getTime() - currentMillis);
  const remainingHours = Math.floor(remainingMillis / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMillis % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingMillis % (1000 * 60)) / 1000);

  return {
    currentWaqt,
    nextWaqt,
    remainingMillis,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    allList: list,
  };
}
