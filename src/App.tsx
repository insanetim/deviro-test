import { CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { observer } from "mobx-react-lite"
import MainLayout from "./layouts/MainLayout"
import { authStore } from "./stores/AuthStore"
import { darkTheme } from "./theme"
import AuthView from "./views/AuthView"
import MapView from "./views/MapView"

const App = observer(() => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainLayout>{authStore.isAuth ? <MapView /> : <AuthView />}</MainLayout>
    </ThemeProvider>
  )
})

export default App
