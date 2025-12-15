import { Button, CircularProgress } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStores } from "../hooks/useStores"

export const ControlButton = observer(() => {
  const { targetsStore } = useStores()
  const buttonText = targetsStore.serverIsRunning ? "Stop" : "Start"

  return (
    <Button
      type="submit"
      variant={targetsStore.serverIsRunning ? "outlined" : "contained"}
      color="primary"
      fullWidth
      size="large"
      disabled={targetsStore.isLoading}
      sx={{
        fontWeight: "bold",
        minWidth: 120,
        position: "relative",
      }}
    >
      {targetsStore.isLoading ? (
        <>
          <span style={{ visibility: "hidden" }}>{buttonText}</span>
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
})
