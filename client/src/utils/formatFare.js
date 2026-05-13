export function capitalize(text) {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text, limit = 100) {
  if (!text) return "";

  if (text.length <= limit) {
    return text;
  }

  return text.substring(0, limit) + "...";
}