import AddIcon from "@mui/icons-material/Add"
import RefreshIcon from "@mui/icons-material/Refresh"
import RemoveIcon from "@mui/icons-material/Remove"
import { Box, Button, ButtonGroup } from "@mui/material"
import { useControls } from "react-zoom-pan-pinch"

const MapControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls()

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "& .MuiButton-root": {
          minWidth: 40,
          minHeight: 40,
          backgroundColor: "white",
          color: "rgba(0, 0, 0, 0.7)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          "&:hover": {
            backgroundColor: "white",
            color: "rgba(0, 0, 0, 0.9)",
          },
        },
      }}
    >
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        size="small"
        sx={{
          "& .MuiButtonGroup-grouped:not(:last-of-type)": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Button
          onClick={() => zoomIn()}
          aria-label="Zoom in"
        >
          <AddIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => zoomOut()}
          aria-label="Zoom out"
        >
          <RemoveIcon fontSize="small" />
        </Button>
      </ButtonGroup>
      <Button
        onClick={() => resetTransform()}
        aria-label="Reset view"
        sx={{
          borderRadius: "50%",
          minWidth: 40,
          minHeight: 40,
        }}
      >
        <RefreshIcon fontSize="small" />
      </Button>
    </Box>
  )
}

export default MapControls
