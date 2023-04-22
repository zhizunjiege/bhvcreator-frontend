const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

export function randomString(length = 8) {
  let s = "";
  for (let i = 0; i < length; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}
