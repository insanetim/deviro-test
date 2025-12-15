export const SIMULATION = {
  UPDATE_INTERVAL_MS: 10,
  FILTER_INTERVAL_MS: 1000,
  AREA_SIZE: 800,
  SPEED: {
    MIN: 10,
    MAX: 100,
    DEFAULT: 20,
  },
  TARGETS: {
    MIN: 10,
    MAX: 500,
    DEFAULT: 100,
  },
  LATENCY: {
    MIN: 10,
    MAX: 200,
    DEFAULT: 20,
  },
} as const

export const TARGET_SIZE = 10
export const TARGET_ACTIVE_COLOR = "#ff4444"
export const TARGET_OFFLINE_COLOR = "#888"
export const TARGET_BORDER_COLOR = "#fff"

export const ACCESS_CODE = crypto.randomUUID()
