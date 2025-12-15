import Konva from "konva"
import { memo, useCallback } from "react"
import { Group, Shape as KonvaShape } from "react-konva"
import {
  TARGET_ACTIVE_COLOR,
  TARGET_BORDER_COLOR,
  TARGET_OFFLINE_COLOR,
  TARGET_SIZE,
} from "../constants"
import type { ExTarget } from "../types"

interface TargetShapeProps {
  target: ExTarget
}

const TargetShape = memo(({ target }: TargetShapeProps) => {
  const color =
    target.status === "active" ? TARGET_ACTIVE_COLOR : TARGET_OFFLINE_COLOR

  const sceneFunc = useCallback(
    (context: Konva.Context) => {
      context.beginPath()
      context.arc(0, 0, TARGET_SIZE / 2, 0, Math.PI * 2)
      context.fillStyle = color
      context.fill()
      context.strokeStyle = TARGET_BORDER_COLOR
      context.lineWidth = 1.5
      context.stroke()
      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo((TARGET_SIZE / 2) * 1.5, 0)
      context.stroke()
    },
    [color]
  )

  return (
    <Group>
      <Group
        x={target.x}
        y={target.y}
        rotation={target.angle}
      >
        <KonvaShape sceneFunc={sceneFunc} />
      </Group>
    </Group>
  )
})

export default TargetShape
