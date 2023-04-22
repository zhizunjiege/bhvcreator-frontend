import { date } from "quasar";

export function getTimestampString(timestamp = Date.now()) {
  return date.formatDate(timestamp, "YYYY/MM/DD HH:mm:ss");
}

export function getDurationString(duration = 0) {
  return date.formatDate(duration, "HH:mm:ss");
}
