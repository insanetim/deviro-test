import { createContext } from "react"
import type { RootStore } from "../stores"

export const StoreContext = createContext<RootStore | undefined>(undefined)
