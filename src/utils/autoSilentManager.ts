import { PrayerTimes, WaqtInfo } from './prayerEngine';

export interface SilentSettings {
  enabled: boolean;
  prePrayerBufferMinutes: number; // e.g. 0 or 2 mins before prayer time
  durations: {
    fajr: number; // in minutes
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  vibrateOnSilent: boolean;
  notifyOnSilent: boolean;
  keepScreenAwake: boolean;
  overrideUntil: number | null; // Milliseconds timestamp
}

export const DEFAULT_SILENT_SETTINGS: SilentSettings = {
  enabled: true,
  prePrayerBufferMinutes: 1, // Start 1 minute before Azan
  durations: {
    fajr: 25, // 25 minutes for Fajr Jama'at & Sunnah
    dhuhr: 20,
    asr: 20,
    maghrib: 15,
    isha: 25,
  },
  vibrateOnSilent: true,
  notifyOnSilent: true,
  keepScreenAwake: false,
  overrideUntil: null,
};

export interface SilentStatus {
  isSilenced: boolean;
  activePrayerId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | null;
  activePrayerNameBn: string | null;
  startTime: Date | null;
  endTime: Date | null;
  remainingSeconds: number;
  totalSeconds: number;
  isOverridden: boolean;
}

export const PRAYER_NAMES_BN: Record<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', string> = {
  fajr: 'ফজর',
  dhuhr: 'যোহর',
  asr: 'আসর',
  maghrib: 'মাগরিব',
  isha: 'এশা',
};

// Check if current time falls into any prayer silent window
export function checkSilentStatus(
  times: PrayerTimes,
  settings: SilentSettings,
  now: Date = new Date()
): SilentStatus {
  if (!settings.enabled) {
    return {
      isSilenced: false,
      activePrayerId: null,
      activePrayerNameBn: null,
      startTime: null,
      endTime: null,
      remainingSeconds: 0,
      totalSeconds: 0,
      isOverridden: false,
    };
  }

  const currentMs = now.getTime();

  // If user manually hit override/unmute for this session
  if (settings.overrideUntil && currentMs < settings.overrideUntil) {
    return {
      isSilenced: false,
      activePrayerId: null,
      activePrayerNameBn: null,
      startTime: null,
      endTime: null,
      remainingSeconds: 0,
      totalSeconds: 0,
      isOverridden: true,
    };
  }

  const prayers: Array<{ id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; time: Date }> = [
    { id: 'fajr', time: times.fajr },
    { id: 'dhuhr', time: times.dhuhr },
    { id: 'asr', time: times.asr },
    { id: 'maghrib', time: times.maghrib },
    { id: 'isha', time: times.isha },
  ];

  for (const prayer of prayers) {
    const durationMinutes = settings.durations[prayer.id] || 20;
    const startMs = prayer.time.getTime() - settings.prePrayerBufferMinutes * 60 * 1000;
    const endMs = startMs + durationMinutes * 60 * 1000;

    if (currentMs >= startMs && currentMs < endMs) {
      const remainingSeconds = Math.max(0, Math.floor((endMs - currentMs) / 1000));
      const totalSeconds = durationMinutes * 60;

      return {
        isSilenced: true,
        activePrayerId: prayer.id,
        activePrayerNameBn: PRAYER_NAMES_BN[prayer.id],
        startTime: new Date(startMs),
        endTime: new Date(endMs),
        remainingSeconds,
        totalSeconds,
        isOverridden: false,
      };
    }
  }

  return {
    isSilenced: false,
    activePrayerId: null,
    activePrayerNameBn: null,
    startTime: null,
    endTime: null,
    remainingSeconds: 0,
    totalSeconds: 0,
    isOverridden: false,
  };
}

// Trigger haptic vibration if supported
export function triggerSilentVibration(type: 'enter' | 'exit') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'enter') {
        // Double gentle pulse
        navigator.vibrate([200, 100, 200]);
      } else {
        // Single release pulse
        navigator.vibrate([150]);
      }
    } catch {
      // Ignore vibration error
    }
  }
}

// Send system notification if permitted
export async function sendSilentNotification(prayerNameBn: string, type: 'enter' | 'exit') {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  try {
    if (Notification.permission === 'granted') {
      if (type === 'enter') {
        new Notification(`🔕 নামাজ সাইলেন্ট সক্রিয় (${prayerNameBn})`, {
          body: `${prayerNameBn} নামাজের সময় শুরু হয়েছে। নামাজের একাগ্রতা বজায় রাখতে ফোন সাইলেন্ট মোডে রয়েছে।`,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          silent: true,
          tag: 'prayer-silent-status',
        });
      } else {
        new Notification(`🔔 নামাজ সাইলেন্ট সমাপ্ত (${prayerNameBn})`, {
          body: `${prayerNameBn} নামাজের নির্ধারিত সময় শেষ হয়েছে। সাইলেন্ট মোড সমাপ্ত।`,
          icon: '/pwa-192x192.png',
          silent: true,
          tag: 'prayer-silent-status',
        });
      }
    }
  } catch {
    // Notification error handled
  }
}

// Generate iCalendar (.ics) file with BUSY / Silent tags for Android Google Calendar / iOS
export function generatePrayerSilentICS(
  startDate: Date,
  daysCount: number,
  lat: number,
  lng: number,
  settings: SilentSettings,
  calculateFn: (date: Date, lat: number, lng: number) => PrayerTimes
): string {
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));

  const formatICSDate = (d: Date): string => {
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      'T' +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      'Z'
    );
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PrayerAutoSilencer//BN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:নামাজ সাইলেন্টার সময়সূচি (Prayer Silent)',
    'X-WR-TIMEZONE:Asia/Dhaka',
  ];

  const prayers: Array<{ id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'; nameBn: string }> = [
    { id: 'fajr', nameBn: 'ফজর নামাজ' },
    { id: 'dhuhr', nameBn: 'যোহর নামাজ' },
    { id: 'asr', nameBn: 'আসর নামাজ' },
    { id: 'maghrib', nameBn: 'মাগরিব নামাজ' },
    { id: 'isha', nameBn: 'এশা নামাজ' },
  ];

  for (let d = 0; d < daysCount; d++) {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + d);
    const times = calculateFn(curDate, lat, lng);

    for (const p of prayers) {
      const pTime = times[p.id];
      const durationMins = settings.durations[p.id] || 20;
      const start = new Date(pTime.getTime() - settings.prePrayerBufferMinutes * 60 * 1000);
      const end = new Date(start.getTime() + durationMins * 60 * 1000);

      const uid = `salat-silent-${curDate.getFullYear()}${pad(curDate.getMonth() + 1)}${pad(curDate.getDate())}-${p.id}@salatsilent.app`;

      ics.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:🔕 ${p.nameBn} - সাইলেন্ট মোড`,
        `DESCRIPTION:নামাজের সময় ফোন স্বয়ংক্রিয় Do Not Disturb বা সাইলেন্ট রাখতে এই ইভেন্ট তৈরি করা হয়েছে।`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE', // Marks user as BUSY (triggers phone DND if enabled)
        'BEGIN:VALARM',
        'TRIGGER:-PT0M',
        'ACTION:DISPLAY',
        `DESCRIPTION:${p.nameBn} সাইলেন্ট শুরু`,
        'END:VALARM',
        'END:VEVENT'
      );
    }
  }

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

export function downloadICSFile(content: string, filename = 'namaz_auto_silent.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
