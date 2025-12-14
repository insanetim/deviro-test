import { makeAutoObservable } from "mobx"

export class TargetsStore {
  serverIsRunning: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  setServerIsRunning = (isRunning: boolean) => {
    this.serverIsRunning = isRunning
  }
}
