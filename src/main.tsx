import { ThemeProvider } from "@mui/material/styles"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { StoreProvider } from "./contexts/StoreProvider.tsx"
import { darkTheme } from "./theme.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </StrictMode>
)
