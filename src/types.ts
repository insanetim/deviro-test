export interface Target {
  id: string
  x: number
  y: number
  speed: number
  angle: number // Angle in degrees (0 points to the right, increases clockwise)
}

export type ServerResponse<T = void> = Promise<{
  success: boolean
  data?: T
  error?: string
}>
