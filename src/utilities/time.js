export function getTime(seconds) {
  const total = Math.floor(seconds);
  const hr = Math.floor(total / 3600);
  const min = Math.floor((total - (hr * 3600)) / 60);
  const sec = total - (hr * 3600) - (min * 60);
  const secStr = `0${sec}`.slice(-2);

  if (hr > 0) {
    const minStr = `0${min}`.slice(-2);
    return `${hr}:${minStr}:${secStr}`;
  }
  return `${min}:${secStr}`;
}
