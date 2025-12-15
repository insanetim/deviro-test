export interface Target {
  id: string
  x: number
  y: number
  speed: number
  angle: number // Angle in degrees (0 points to the right, increases clockwise)
}

export interface ExTarget extends Target {
  lastUpdated: number
  status: "active" | "offline"
}

export type ServerResponse<T = void> = Promise<{
  success: boolean
  data?: T
  error?: string
}>

export interface StartServerParams {
  count?: number
  speed?: number
  latency?: number
}

export interface MapOptions {
  count: number
  speed: number
  offlineTimeout: number
  latency: number
  fps: number
}
