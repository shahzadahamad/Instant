export function timeSince(date: Date) {
  const now = new Date().getTime();
  const past = new Date(date).getTime();

  if (isNaN(past)) {
    throw new Error("Invalid date provided");
  }

  const seconds = Math.floor((now - past) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""}`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} min`;
  } else if (seconds < 10) {
    return "Now";
  } else {
    return `${seconds} sec`;
  }
}