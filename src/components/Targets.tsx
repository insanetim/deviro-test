import Konva from "konva"
import { observer } from "mobx-react-lite"
import { useCallback } from "react"
import { Layer, Shape, Stage } from "react-konva"
import {
  SIMULATION,
  TARGET_ACTIVE_COLOR,
  TARGET_BORDER_COLOR,
  TARGET_OFFLINE_COLOR,
  TARGET_SIZE,
} from "../constants"
import { useStores } from "../hooks/useStores"

const Targets = observer(() => {
  const { targetsStore } = useStores()
  const stageWidth = SIMULATION.AREA_SIZE
  const stageHeight = SIMULATION.AREA_SIZE

  const drawTargets = useCallback(
    (context: Konva.Context) => {
      // Convert Map values to array
      const targets = Array.from(targetsStore.targets.values())

      targets.forEach(target => {
        // Save the current context state
        context.save()

        // Move to target position
        context.translate(target.x, target.y)

        // Rotate the context
        context.rotate((target.angle * Math.PI) / 180)

        // Draw the circle
        context.beginPath()
        context.arc(0, 0, TARGET_SIZE / 2, 0, Math.PI * 2)
        context.fillStyle =
          target.status === "active"
            ? TARGET_ACTIVE_COLOR
            : TARGET_OFFLINE_COLOR
        context.fill()

        // Draw the border
        context.strokeStyle = TARGET_BORDER_COLOR
        context.lineWidth = 1.5
        context.stroke()

        // Draw the direction indicator
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo((TARGET_SIZE / 2) * 1.5, 0)
        context.stroke()

        // Restore the context state
        context.restore()
      })
    },
    [targetsStore.targets]
  )

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      style={{
        width: `${SIMULATION.AREA_SIZE}px`,
        height: `${SIMULATION.AREA_SIZE}px`,
        maxWidth: "100%",
        maxHeight: "100%",
        display: "block",
      }}
    >
      <Layer>
        <Shape sceneFunc={drawTargets} />
      </Layer>
    </Stage>
  )
})

export default Targets
