import { makeAutoObservable, runInAction } from "mobx"
import { mockServer } from "../server/mockServer"
import type { ExTarget, MapOptions, Target } from "../types"

const normalizeTargets = (targets: Target[]): Record<Target["id"], Target> => {
  return targets.reduce((acc, target) => {
    acc[target.id] = target
    return acc
  }, {} as Record<Target["id"], Target>)
}

/**
 * MobX store for managing targets and server state.
 * Handles server connection, target updates, and offline/online status tracking.
 */
export class TargetsStore {
  /** Whether the mock server is currently running */
  serverIsRunning: boolean = false

  /** Map of target IDs to target objects */
  targets: Record<Target["id"], ExTarget> = {}

  /** Time in milliseconds before a target is considered offline */
  offlineTimeout: number = 60000 // 1 minute default

  // Server operation states
  /** Whether a server operation is in progress */
  isLoading: boolean = false
  /** Last error that occurred during server operations */
  error: string | null = null

  // Target fetching states
  /** Whether targets are currently being fetched */
  isFetching: boolean = false
  /** Last error that occurred during target fetching */
  fetchError: string | null = null

  /** Counter for tracking fetch requests to handle race conditions */
  private fetchRequestId: number = 0
  /** Timestamp of the last successful target update */
  private lastProcessedTime: number = 0
  /** Minimum time in milliseconds between target updates (throttling) */
  private readonly MIN_UPDATE_INTERVAL: number = 100

  /**
   * Initializes a new instance of the TargetsStore.
   * Sets up MobX observables and actions.
   */
  constructor() {
    makeAutoObservable(this)
  }

  /**
   * Starts the mock server with the specified options.
   * @param options - Configuration options for the server
   * @returns Promise that resolves when the server is started
   * @throws Error if server fails to start
   */
  startServer = async (options?: MapOptions) => {
    this.isLoading = true
    this.error = null
    this.targets = {}
    this.fetchRequestId = 0
    if (
      options?.offlineTimeout !== undefined &&
      !isNaN(options.offlineTimeout) &&
      options.offlineTimeout > 0
    ) {
      this.offlineTimeout = options.offlineTimeout
    }

    try {
      const response = await mockServer.start({
        count: options?.count,
        speed: options?.speed,
        latency: options?.latency,
      })
      runInAction(() => {
        this.serverIsRunning = true
        this.isLoading = false
      })
      return response
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : "Failed to start server"
        this.isLoading = false
      })
      throw error
    }
  }

  /**
   * Stops the mock server and clears the targets.
   * @returns Promise that resolves when the server is stopped
   * @throws Error if server fails to stop
   */
  stopServer = async () => {
    this.isLoading = true
    this.error = null

    try {
      const response = await mockServer.stop()
      runInAction(() => {
        this.serverIsRunning = false
        this.isLoading = false
      })
      return response
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : "Failed to stop server"
        this.isLoading = false
      })
      throw error
    }
  }

  /**
   * Fetches the current list of targets from the server.
   * Handles throttling, offline detection, and state updates.
   * @returns Promise that resolves with the server response
   * @throws Error if fetching fails
   */
  fetchTargets = async () => {
    if (!this.serverIsRunning) {
      this.targets = {}
      return { success: false, error: "Server is not running" }
    }

    const currentRequestId = ++this.fetchRequestId
    this.isFetching = true
    this.fetchError = null
    const now = Date.now()
    const timeSinceLastUpdate = now - this.lastProcessedTime
    const shouldSkipUpdate = timeSinceLastUpdate < this.MIN_UPDATE_INTERVAL

    try {
      const response = await mockServer.getTargets()

      // Skip processing if a newer request was made and we're still within the minimum update interval
      if (currentRequestId !== this.fetchRequestId && shouldSkipUpdate) {
        return { success: false, error: "Skipping intermediate update" }
      }

      const normalizedResponse = normalizeTargets(response.data || [])

      runInAction(() => {
        // Double-check request ID and update interval in case of race conditions
        if (
          currentRequestId !== this.fetchRequestId &&
          Date.now() - this.lastProcessedTime < this.MIN_UPDATE_INTERVAL
        ) {
          return
        }

        try {
          if (!response.success || !response.data) {
            this.targets = {}
            return
          }

          // Initial load
          if (Object.keys(this.targets).length === 0) {
            this.targets = Object.keys(normalizedResponse).reduce(
              (acc, key) => {
                acc[key] = {
                  ...normalizedResponse[key],
                  lastUpdated: now,
                  status: "active" as const,
                }
                return acc
              },
              {} as Record<Target["id"], ExTarget>
            )
          } else {
            // Update existing targets
            this.targets = Object.keys(this.targets).reduce((acc, key) => {
              if (normalizedResponse[key]) {
                // Target is in the response - mark as active
                acc[key] = {
                  ...normalizedResponse[key],
                  lastUpdated: now,
                  status: "active" as const,
                }
              } else {
                // Target is not in the response - check offline timeout
                const target = this.targets[key]
                if (now - target.lastUpdated >= this.offlineTimeout) {
                  // Skip adding to acc - effectively removes the target
                  return acc
                }
                // Keep target but mark as offline
                acc[key] = {
                  ...target,
                  status: "offline" as const,
                }
              }
              return acc
            }, {} as Record<Target["id"], ExTarget>)
          }
        } finally {
          this.isFetching = false
          // Update last processed time
          this.lastProcessedTime = Date.now()
        }
      })

      return response
    } catch (error) {
      runInAction(() => {
        this.fetchError =
          error instanceof Error ? error.message : "Failed to fetch targets"
        this.isFetching = false
      })
      throw error
    }
  }
}
