import { observer } from "mobx-react-lite"
import { Layer, Stage } from "react-konva"
import { useStores } from "../hooks/useStores"
import TargetShape from "./TargetShape"

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
