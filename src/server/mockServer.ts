import type { ServerResponse, StartServerParams, Target } from "../types"

// Helper functions
const toRadians = (degrees: number) => degrees * (Math.PI / 180)
const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360
const chance = (percent: number): boolean => Math.random() * 100 < percent
const randomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const randomDelay = (min: number = 100, max: number = 500) =>
  wait(randomInteger(min, max))

class MockServer {
  private targets: Target[] = []
  private updateInterval: number | null = null
  private isRunning: boolean = false
  private targetCounter: number = 0
  private lastUpdateTime: number = 0
  private readonly UPDATE_INTERVAL_MS = 500
  private readonly AREA_SIZE = 800
  private readonly SPEED = {
    MIN: 1,
    MAX: 20,
    DEFAULT: 5,
  }
  private readonly TARGETS = {
    MIN: 1,
    MAX: 200,
    DEFAULT: 50,
  }

  constructor() {
    this.targets = []
  }

  private initializeTargets({
    count = this.TARGETS.DEFAULT,
    speed = this.SPEED.DEFAULT,
  }: StartServerParams = {}) {
    for (let i = 0; i < count; i++) {
      this.targets.push(this.createRandomTarget(speed))
    }
  }

  private createRandomTarget(speed: number = this.SPEED.DEFAULT): Target {
    return {
      id: `t_${Date.now()}_${++this.targetCounter}`,
      x: randomInteger(0, this.AREA_SIZE),
      y: randomInteger(0, this.AREA_SIZE),
      speed: speed * (1 + randomInteger(-30, 30) / 100), // Add some randomness
      angle: randomInteger(0, 359),
    }
  }

  private updateTargets() {
    const now = Date.now()
    const deltaTimeMs = this.lastUpdateTime ? now - this.lastUpdateTime : 0
    this.lastUpdateTime = now

    this.targets = this.targets.filter(() => !chance(1))

    this.targets = this.targets.map(target => {
      const angleInRadians = toRadians(target.angle)
      // Calculate movement based on speed (units per second) and actual time passed
      const distance = target.speed * (deltaTimeMs / 1000)
      const dx = Math.cos(angleInRadians) * distance
      const dy = Math.sin(angleInRadians) * distance

      let newX = target.x + dx
      let newY = target.y + dy
      let newAngle = target.angle

      const maxX = this.AREA_SIZE
      const maxY = this.AREA_SIZE
      let bounced = false

      // Check collision with horizontal boundaries (left/right)
      if (newX < 0) {
        newX = Math.abs(newX)
        newAngle = normalizeAngle(180 - target.angle)
        bounced = true
      } else if (newX > maxX) {
        newX = maxX - (newX - maxX)
        newAngle = normalizeAngle(180 - target.angle)
        bounced = true
      }

      // Check collision with vertical boundaries (top/bottom)
      if (newY < 0) {
        newY = Math.abs(newY)
        newAngle = normalizeAngle(-target.angle)
        bounced = true
      } else if (newY > maxY) {
        newY = maxY - (newY - maxY)
        newAngle = normalizeAngle(-target.angle)
        bounced = true
      }

      // Angle is updated during collision checks

      // 30% chance to randomly change angle after bounce
      if (bounced && chance(30)) {
        newAngle = normalizeAngle(newAngle + randomInteger(-25, 25) / 10)
      } else {
        newAngle = normalizeAngle(newAngle)
      }

      return {
        ...target,
        x: newX,
        y: newY,
        angle: newAngle,
      }
    })
  }

  public async start({
    count = this.TARGETS.DEFAULT,
    speed = this.SPEED.DEFAULT,
  }: StartServerParams = {}): ServerResponse {
    await randomDelay()

    if (this.isRunning) {
      throw new Error("Server is already running")
    }

    if (count < this.TARGETS.MIN || count > this.TARGETS.MAX) {
      throw new Error(
        `Targets count must be between ${this.TARGETS.MIN} and ${this.TARGETS.MAX}`
      )
    }

    if (speed < this.SPEED.MIN || speed > this.SPEED.MAX) {
      throw new Error(
        `Speed must be between ${this.SPEED.MIN} and ${this.SPEED.MAX}`
      )
    }

    try {
      this.targets = []
      this.targetCounter = 0
      this.initializeTargets({ count, speed })

      this.isRunning = true
      this.lastUpdateTime = Date.now()
      this.updateInterval = window.setInterval(() => {
        this.updateTargets()
      }, this.UPDATE_INTERVAL_MS)

      return { success: true }
    } catch (error) {
      this.isRunning = false
      if (this.updateInterval !== null) {
        clearInterval(this.updateInterval)
        this.updateInterval = null
      }
      this.targets = []
      throw error
    }
  }

  public async stop(): ServerResponse {
    await randomDelay()

    if (!this.isRunning) {
      throw new Error("Server is not running")
    }

    try {
      if (this.updateInterval !== null) {
        clearInterval(this.updateInterval)
        this.updateInterval = null
      }
      this.isRunning = false
      return { success: true }
    } catch (error) {
      this.isRunning = false
      throw error
    }
  }

  public async getTargets(): ServerResponse<Target[]> {
    await randomDelay()

    if (!this.isRunning) {
      throw new Error("Server is not running")
    }

    return {
      success: true,
      data: [...this.targets],
    }
  }
}

export const mockServer = new MockServer()

/**
 * Запуск сервера
 */
export const start = async ({
  count = 10,
  speed = 10,
}: StartServerParams = {}): ServerResponse => {
  try {
    return await mockServer.start({ count, speed })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Остановка сервера
 */
export const stop = async (): ServerResponse => {
  try {
    return await mockServer.stop()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Получение списка целей
 */
export const getTargets = async (): ServerResponse<Target[]> => {
  try {
    return await mockServer.getTargets()
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
