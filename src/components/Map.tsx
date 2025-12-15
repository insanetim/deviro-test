import { Box } from "@mui/material"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import map from "../assets/map.jpg"
import { SIMULATION } from "../constants"
import MapControls from "./MapControls"
import Targets from "./Targets"

interface MapProps {
  size?: number
}

const Map: React.FC<MapProps> = ({ size = SIMULATION.AREA_SIZE }) => {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
      }}
    >
      <TransformWrapper disablePadding>
        {() => (
          <>
            <MapControls />
            <TransformComponent>
              <Box
                sx={{
                  position: "relative",
                  width: size,
                  height: size,
                  backgroundImage: `url(${map})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <Targets />
              </Box>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </Box>
  )
}

export default Map
