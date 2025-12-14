import { useContext } from "react"
import { StoreContext } from "../contexts/StoreContext"

export const useStores = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStores must be used within StoreProvider")
  }
  return context
}
