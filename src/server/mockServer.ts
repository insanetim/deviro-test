import { SIMULATION } from "../constants"
import type { ServerResponse, StartServerParams, Target } from "../types"

// Helper functions
const toRadians = (degrees: number) => degrees * (Math.PI / 180)
const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360
const chance = (percent: number): boolean => Math.random() * 100 < percent
const randomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const withRandomness = (value: number, percent: number) =>
  value * (1 + randomInteger(-percent, percent) / 100)

class MockServer {
  private isRunning: boolean = false
  private updateInterval: number | null = null
  private readonly UPDATE_INTERVAL_MS = SIMULATION.UPDATE_INTERVAL_MS
  private latency: number = SIMULATION.LATENCY.DEFAULT
  private targets: Target[] = []
  private targetCounter: number = 0
  private lastUpdateTime: number = 0
  private lastFilterTime: number = 0
  private readonly areaSize = SIMULATION.AREA_SIZE
  private readonly speed = SIMULATION.SPEED
  private readonly targetsCount = SIMULATION.TARGETS

  constructor() {
    this.targets = []
  }

  /**
   * Simulates network latency by delaying execution.
   * @returns Promise that resolves after a random delay based on configured latency
   */
  private async serverDelay() {
    return wait(withRandomness(this.latency, 25))
  }

  /**
   * Initializes the targets array with random targets.
   * @param params - Configuration parameters
   * @param params.count - Number of targets to create
   * @param params.speed - Base speed for the targets
   */
  private initializeTargets({
    count = this.targetsCount.DEFAULT,
    speed = this.speed.DEFAULT,
  }: StartServerParams = {}) {
    for (let i = 0; i < count; i++) {
      this.targets.push(this.createRandomTarget(speed))
    }
  }

  /**
   * Creates a new target with random position and direction.
   * @param speed - Base speed for the target
   * @returns A new target object with random properties
   */
  private createRandomTarget(speed: number = this.speed.DEFAULT): Target {
    return {
      id: `t_${Date.now()}_${++this.targetCounter}`,
      x: randomInteger(0, this.areaSize),
      y: randomInteger(0, this.areaSize),
      speed: withRandomness(speed, 30), // Add some randomness to speed
      angle: randomInteger(0, 359),
    }
  }

  /**
   * Updates the positions and states of all targets.
   * Handles movement, boundary collision detection, and random target removal.
   */
  private updateTargets() {
    const now = Date.now()
    const deltaTimeMs = this.lastUpdateTime ? now - this.lastUpdateTime : 0
    this.lastUpdateTime = now

    // Randomly remove some targets at specified intervals to simulate real-world conditions
    if (now - this.lastFilterTime > SIMULATION.FILTER_INTERVAL_MS) {
      this.targets = this.targets.filter(() => !chance(1))
      this.lastFilterTime = now
    }

    this.targets = this.targets.map(target => {
      const angleInRadians = toRadians(target.angle)
      // Calculate movement based on speed (units per second) and actual time passed
      const distance = target.speed * (deltaTimeMs / 1000)
      const dx = Math.cos(angleInRadians) * distance
      const dy = Math.sin(angleInRadians) * distance

      let newX = target.x + dx
      let newY = target.y + dy
      let newAngle = target.angle

      const maxX = this.areaSize
      const maxY = this.areaSize
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
        newAngle = normalizeAngle(withRandomness(newAngle, 2.5))
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
    count = this.targetsCount.DEFAULT,
    speed = this.speed.DEFAULT,
    latency = this.latency,
  }: StartServerParams = {}): ServerResponse {
    await this.serverDelay()

    if (this.isRunning) {
      throw new Error("Server is already running")
    }

    if (count < this.targetsCount.MIN || count > this.targetsCount.MAX) {
      throw new Error(
        `Targets count must be between ${this.targetsCount.MIN} and ${this.targetsCount.MAX}`
      )
    }

    if (speed < this.speed.MIN || speed > this.speed.MAX) {
      throw new Error(
        `Speed must be between ${this.speed.MIN} and ${this.speed.MAX}`
      )
    }

    if (latency < 0 || latency > 1000) {
      throw new Error(
        `Latency must be between ${SIMULATION.LATENCY.MIN} and ${SIMULATION.LATENCY.MAX}`
      )
    }

    try {
      this.targets = []
      this.targetCounter = 0
      this.initializeTargets({ count, speed })

      this.isRunning = true
      this.latency = latency
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
    this.latency = SIMULATION.LATENCY.DEFAULT
    await this.serverDelay()

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
    await this.serverDelay()

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
 * Starts the mock server with the specified parameters.
 * @param params - Server configuration
 * @param params.count - Number of targets to create
 * @param params.speed - Base speed for targets
 * @param params.latency - Network latency simulation in milliseconds
 * @returns Promise that resolves with the server response
 */
export const start = async ({
  count = SIMULATION.TARGETS.DEFAULT,
  speed = SIMULATION.SPEED.DEFAULT,
  latency = SIMULATION.LATENCY.DEFAULT,
}: StartServerParams = {}): ServerResponse => {
  try {
    return await mockServer.start({ count, speed, latency })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Stops the mock server and cleans up resources.
 * @returns Promise that resolves when the server is fully stopped
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
 * Retrieves the current list of targets from the server.
 * @returns Promise that resolves with the current targets
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
