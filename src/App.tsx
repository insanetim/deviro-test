import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import MainLayout from "./layouts/MainLayout"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainLayout>
        <div>
          <h1>Top Secret Project</h1>
        </div>
      </MainLayout>
    </ThemeProvider>
  )
}

export default App
