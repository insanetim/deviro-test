import { makeAutoObservable } from "mobx"
import { AuthStore } from "./AuthStore"
import { TargetsStore } from "./TargetsStore"

export class RootStore {
  authStore: AuthStore
  targetsStore: TargetsStore

  constructor() {
    this.authStore = new AuthStore()
    this.targetsStore = new TargetsStore()

    makeAutoObservable(this)
  }
}
