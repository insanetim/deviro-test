/**
 * Converts a number of seconds into a human-readable time string.
 *
 * @param {number} seconds - The number of seconds to convert.
 * @returns {string} A formatted string representing the time (e.g., '30s', '2m 30s', '5m').
 */
export const convertSeconds = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`
}
