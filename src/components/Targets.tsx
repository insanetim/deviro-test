import { observer } from "mobx-react-lite"
import { Group, Shape as KonvaShape, Layer, Stage } from "react-konva"
import { useStores } from "../hooks/useStores"
import type { ExTarget } from "../types"

const TARGET_SIZE = 10 // Size of the triangle
const ACTIVE_COLOR = "#ff4444" // Red for active targets
const OFFLINE_COLOR = "#888888" // Grey for offline targets
const BORDER_COLOR = "#ffffff" // White border for better visibility

interface TargetShapeProps {
  target: ExTarget
}

const TargetShape = ({ target }: TargetShapeProps) => {
  const color = target.status === "active" ? ACTIVE_COLOR : OFFLINE_COLOR

  // Triangle dimensions
  const triangleWidth = TARGET_SIZE * 2.5
  const triangleHeight = TARGET_SIZE * 1.5



  return (
    <Group x={target.x} y={target.y}>
      <Group
        x={0}
        y={0}
        rotation={target.angle} // Point in the direction of movement
      >
        <KonvaShape
          sceneFunc={(context) => {
            // Draw the main triangle (pointing right by default)
            context.beginPath()
            context.moveTo(triangleWidth, triangleHeight / 2)  // Right point
            context.lineTo(0, 0)                                // Top left
            context.lineTo(0, triangleHeight)                  // Bottom left
            context.closePath()
            // Fill the triangle
            context.fillStyle = color
            context.fill()
            // Draw the border
            context.strokeStyle = BORDER_COLOR
            context.lineWidth = 1.5
            context.stroke()

            // Draw a small circle at the right vertex to indicate rotation
            context.beginPath()
            context.arc(triangleWidth, triangleHeight / 2, 3, 0, Math.PI * 2)
            context.fillStyle = 'white'
            context.fill()
            context.strokeStyle = BORDER_COLOR
            context.lineWidth = 1
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
