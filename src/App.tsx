import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <h1>Top Secret Project</h1>
      </div>
    </ThemeProvider>
  )
}

export default App
