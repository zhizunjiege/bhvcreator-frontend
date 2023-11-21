export const offset = new Date().getTimezoneOffset() * 60 * 1000;

export function getTimestampString(timestamp = Date.now(), local = true) {
  const d = new Date(timestamp - (local ? offset : 0));
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export function getTimestampNumber(timestamp = "", local = true) {
  const d = new Date(timestamp || "1970-01-01");
  return d.valueOf() - (local ? 0 : offset);
}

export function getDurationString(duration = 0, trunc = true) {
  const d = new Date(duration);
  return d.toISOString().slice(11, trunc ? 19 : 24);
}

export function getDurationNumber(duration = "", trunc = true) {
  const d = new Date(`1970-01-01 ${trunc ? duration.slice(0, 8) : duration}`);
  return d.valueOf() - offset;
}
