import { makeAutoObservable, runInAction } from "mobx"
import { mockServer } from "../server/mockServer"
import type { MapOptions, Target } from "../types"

export class TargetsStore {
  serverIsRunning: boolean = false
  targets: Target[] = []
  offlineTimeout: number = 300000

  // For server operations (start/stop)
  isLoading: boolean = false
  error: string | null = null

  // For targets fetching
  isFetching: boolean = false
  fetchError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  private setServerIsRunning = (isRunning: boolean) => {
    this.serverIsRunning = isRunning
  }

  startServer = async (options?: MapOptions) => {
    this.isLoading = true
    this.error = null
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
      })
      runInAction(() => {
        this.setServerIsRunning(true)
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

  stopServer = async () => {
    this.isLoading = true
    this.error = null

    try {
      const response = await mockServer.stop()
      runInAction(() => {
        this.setServerIsRunning(false)
        this.targets = []
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

  fetchTargets = async () => {
    if (!this.serverIsRunning) {
      this.targets = []
      return { success: false, error: "Server is not running" }
    }

    this.isFetching = true
    this.fetchError = null

    try {
      const response = await mockServer.getTargets()
      runInAction(() => {
        if (response.success && response.data) {
          this.targets = response.data
        }
        this.isFetching = false
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
