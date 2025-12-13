import type { ServerResponse, Target } from "../types"

// Helper functions
const toRadians = (degrees: number) => degrees * (Math.PI / 180)
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
  private readonly UPDATE_INTERVAL_MS = 1000
  private readonly AREA_SIZE = 1000
  private readonly SPEED = {
    MIN: 1,
    MAX: 20,
    DEFAULT: 10,
  }
  private readonly TARGETS = {
    MIN: 1,
    MAX: 200,
    DEFAULT: 50,
  }

  constructor() {
    this.targets = []
  }

  private initializeTargets(
    count: number = this.TARGETS.DEFAULT,
    speed: number = this.SPEED.DEFAULT
  ) {
    for (let i = 0; i < count; i++) {
      this.targets.push(this.createRandomTarget(speed))
    }
  }

  private createRandomTarget(speed: number = this.SPEED.DEFAULT): Target {
    return {
      id: `t_${Date.now()}_${++this.targetCounter}`,
      x: randomInteger(0, this.AREA_SIZE),
      y: randomInteger(0, this.AREA_SIZE),
      speed: speed * (1 + randomInteger(-30, 30) / 100),
      angle: randomInteger(0, 359),
    }
  }

  private updateTargets() {
    this.targets = this.targets.filter(() => !chance(1))

    this.targets = this.targets.map(target => {
      const angleInRadians = toRadians(target.angle)
      const dx = Math.cos(angleInRadians) * target.speed
      const dy = Math.sin(angleInRadians) * target.speed

      let newX = target.x + dx
      let newY = target.y + dy
      let newAngle = target.angle

      const maxX = this.AREA_SIZE
      const maxY = this.AREA_SIZE
      let bouncedHorizontally = false
      let bouncedVertically = false

      // Проверка столкновения с горизонтальными границами
      if (newX < 0) {
        newX = Math.abs(newX)
        bouncedHorizontally = true
      } else if (newX > maxX) {
        newX = maxX - (newX - maxX)
        bouncedHorizontally = true
      }

      // Проверка столкновения с вертикальными границами
      if (newY < 0) {
        newY = Math.abs(newY)
        bouncedVertically = true
      } else if (newY > maxY) {
        newY = maxY - (newY - maxY)
        bouncedVertically = true
      }

      // Обновление угла при отражении
      if (bouncedHorizontally) {
        newAngle = 180 - target.angle
      }
      if (bouncedVertically) {
        newAngle = -target.angle
      }

      // Нормализация угла к диапазону 0-359 градусов
      newAngle = ((newAngle % 360) + 360) % 360

      // 30% шанс на случайное изменение угла после отражения
      if ((bouncedHorizontally || bouncedVertically) && chance(30)) {
        newAngle += randomInteger(-25, 25) / 10
        newAngle = ((newAngle % 360) + 360) % 360
      }

      return {
        ...target,
        x: newX,
        y: newY,
        angle: newAngle,
      }
    })
  }

  public async start(
    initialTargets: number = this.TARGETS.DEFAULT,
    initialSpeed: number = this.SPEED.DEFAULT
  ): ServerResponse {
    await randomDelay()

    if (this.isRunning) {
      throw new Error("Server is already running")
    }

    if (
      initialTargets < this.TARGETS.MIN ||
      initialTargets > this.TARGETS.MAX
    ) {
      throw new Error(
        `Initial targets count must be between ${this.TARGETS.MIN} and ${this.TARGETS.MAX}`
      )
    }

    if (initialSpeed < this.SPEED.MIN || initialSpeed > this.SPEED.MAX) {
      throw new Error(
        `Initial speed must be between ${this.SPEED.MIN} and ${this.SPEED.MAX}`
      )
    }

    try {
      this.targets = []
      this.targetCounter = 0
      this.initializeTargets(initialTargets, initialSpeed)

      this.isRunning = true
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

const mockServer = new MockServer()

/**
 * Запуск сервера
 */
export const start = async (
  initialTargetsCount: number = 10,
  initialSpeed: number = 10
): ServerResponse => {
  try {
    return await mockServer.start(initialTargetsCount, initialSpeed)
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
