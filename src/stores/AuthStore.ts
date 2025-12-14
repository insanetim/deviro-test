import { makeAutoObservable } from "mobx"

export class AuthStore {
  isAuth: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  login = () => {
    this.isAuth = true
  }

  logout = () => {
    this.isAuth = false
  }
}
