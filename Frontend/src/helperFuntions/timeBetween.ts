export function timeBetween(date: Date) {
  const FIVE_MINUTES_IN_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
  const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

  const lastOnlineDate = new Date(date || 0); // Use the provided date or fallback to 0
  const now = new Date();

  const timeDifference = now.getTime() - lastOnlineDate.getTime();

  // Check if the time difference is more than 5 minutes but less than 5 hours
  return timeDifference > FIVE_MINUTES_IN_MS && timeDifference <= FIVE_HOURS_IN_MS;
}
