export const SIMULATION = {
  UPDATE_INTERVAL_MS: 100,
  FILTER_INTERVAL_MS: 1000,
  AREA_SIZE: 800,
  SPEED: {
    MIN: 1,
    MAX: 50,
    DEFAULT: 20,
  },
  TARGETS: {
    MIN: 1,
    MAX: 300,
    DEFAULT: 100,
  },
} as const

export const POLLING_INTERVAL = 300

export const TARGET_SIZE = 10
export const TARGET_ACTIVE_COLOR = "#ff4444"
export const TARGET_OFFLINE_COLOR = "#888"
export const TARGET_BORDER_COLOR = "#fff"

export const ACCESS_CODE = crypto.randomUUID()
