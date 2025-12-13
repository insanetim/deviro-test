import { createContext, useContext } from 'react';
import { AuthStore } from './AuthStore';

// Create a context for the root store
class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore();
  }
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

// Create a hook to use the root store
export const useStore = () => useContext(StoreContext);

export default rootStore;
