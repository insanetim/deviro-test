import { CssBaseline, Stack } from "@mui/material"
import type { PropsWithChildren } from "react"

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <CssBaseline />
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", px: 2 }}
      >
        {children}
      </Stack>
    </>
  )
}

export default MainLayout
