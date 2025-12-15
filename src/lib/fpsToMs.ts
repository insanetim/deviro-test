export function fpsToMs(fps: number): number {
  if (typeof fps !== "number" || isNaN(fps) || !isFinite(fps) || fps <= 0) {
    throw new Error("FPS must be a positive number")
  }
  return 1000 / fps
}
