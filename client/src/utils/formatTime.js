function formatTime(minutes) {
  if (!minutes) return "";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} mins`;
  }

  return `${hours} hr ${remainingMinutes} mins`;
}

export default formatTime;