import { Button } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStores } from "../hooks/useStores"

export const ControlButton = observer(() => {
  const { targetsStore } = useStores()

  return (
    <Button
      type="submit"
      variant={targetsStore.serverIsRunning ? "outlined" : "contained"}
      color="primary"
      fullWidth
      size="large"
      sx={{ fontWeight: "bold" }}
    >
      {targetsStore.serverIsRunning ? "Stop" : "Start"}
    </Button>
  )
})
