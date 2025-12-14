import { createContext, useContext, type ReactNode } from "react"
import { RootStore } from "../stores"

interface StoreProviderProps {
  children: ReactNode
}

export const StoreContext = createContext<RootStore | undefined>(undefined)

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const rootStore = new RootStore()

  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  )
}

export const useStores = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStores must be used within StoreProvider")
  }
  return context
}
