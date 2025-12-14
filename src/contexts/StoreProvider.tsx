import { type PropsWithChildren, useMemo } from "react"
import { RootStore } from "../stores"
import { StoreContext } from "./StoreContext"

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const rootStore = useMemo(() => new RootStore(), [])

  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  )
}
