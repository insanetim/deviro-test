import { observer } from "mobx-react-lite"
import { Group, Shape as KonvaShape, Layer, Stage } from "react-konva"
import { useStores } from "../hooks/useStores"
import type { ExTarget } from "../types"

const TARGET_SIZE = 10 // Diameter of the target dot
const ACTIVE_COLOR = "#ff4444" // Red for active targets
const OFFLINE_COLOR = "#888888" // Grey for offline targets
const BORDER_COLOR = "#ffffff" // White border and angle indicator color

interface TargetShapeProps {
  target: ExTarget
}

const TargetShape = ({ target }: TargetShapeProps) => {
  const color = target.status === "active" ? ACTIVE_COLOR : OFFLINE_COLOR

  const radius = TARGET_SIZE / 2

  return (
    <Group>
      <Group
        x={target.x}
        y={target.y}
        rotation={target.angle}
      >
        <KonvaShape
          sceneFunc={context => {
            // Draw the target dot
            context.beginPath()
            context.arc(0, 0, radius, 0, Math.PI * 2)
            context.fillStyle = color
            context.fill()

            // Draw the border
            context.strokeStyle = BORDER_COLOR
            context.lineWidth = 1.5
            context.stroke()

            // Draw angle indicator line
            context.beginPath()
            context.moveTo(0, 0)
            context.lineTo(radius * 1.5, 0)
            context.strokeStyle = BORDER_COLOR
            context.lineWidth = 1.5
            context.stroke()
          }}
        />
      </Group>
    </Group>
  )
}

const Targets = observer(() => {
  const { targetsStore } = useStores()
  const stageWidth = 800
  const stageHeight = 800

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      style={{
        width: "800px",
        height: "800px",
        maxWidth: "100%",
        maxHeight: "100%",
        display: "block",
      }}
    >
      <Layer>
        {Object.values(targetsStore.targets).map(target => (
          <TargetShape
            key={target.id}
            target={target}
          />
        ))}
      </Layer>
    </Stage>
  )
})

export default Targets
