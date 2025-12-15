/**
 * Converts frames per second (FPS) to milliseconds per frame.
 *
 * @param {number} fps - The number of frames per second. Must be a positive number.
 * @returns {number} The number of milliseconds per frame.
 * @throws {Error} If the input is not a positive number.
 */
export function fpsToMs(fps: number): number {
  if (typeof fps !== "number" || isNaN(fps) || !isFinite(fps) || fps <= 0) {
    throw new Error("FPS must be a positive number")
  }
  return 1000 / fps
}
