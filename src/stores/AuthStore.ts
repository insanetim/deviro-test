import { makeAutoObservable } from 'mobx';

export class AuthStore {
  isAuth = false;

  constructor() {
    makeAutoObservable(this);
  }

  login = () => {
    this.isAuth = true;
  };

  logout = () => {
    this.isAuth = false;
  };
}

export const authStore = new AuthStore();

export default AuthStore;
