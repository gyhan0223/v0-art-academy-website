import { CAMP_INFO } from "@/lib/winter-camp";
import { AWAKE_MINUTES, SLEEP_HOURS, WAKE_TIME, SLEEP_TIME } from "@/lib/winter-schedule";

/** Count both camp dates in UTC so the host timezone cannot change the result. */
export function countCampDays(startDateISO: string, endDateISO: string) {
  const start = Date.parse(`${startDateISO}T00:00:00Z`);
  const end = Date.parse(`${endDateISO}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    throw new RangeError("Camp dates must form a valid, ordered date range.");
  }
  return Math.round((end - start) / 86_400_000) + 1;
}

/** Schedule span includes lessons, practice, meals, rest and daily living. */
export function getGrade11WinterTime() {
  const days = countCampDays(CAMP_INFO.startDateISO, CAMP_INFO.endDateISO);
  const dailyHours = AWAKE_MINUTES / 60;
  return {
    startDateISO: CAMP_INFO.startDateISO,
    endDateISO: CAMP_INFO.endDateISO,
    days,
    dailyHours,
    totalHours: days * dailyHours,
    sleepHours: SLEEP_HOURS,
    dayStart: WAKE_TIME,
    dayEnd: SLEEP_TIME,
  };
}
