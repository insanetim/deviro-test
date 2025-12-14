import { Box, Button, ButtonGroup } from "@mui/material"
import { useCallback, useRef, useState } from "react"

const Map = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const minScale = 1
  const maxScale = 3
  const zoomStep = 0.5
  const canvasWidth = 800
  const canvasHeight = 800

  // Ограничение позиции, чтобы не показывать фон
  const clampPosition = useCallback(
    (x: number, y: number, currentScale: number) => {
      if (!containerRef.current) return { x: 0, y: 0 }

      const containerWidth = 800
      const containerHeight = 800

      // Максимально допустимые смещения
      const scaledWidth = canvasWidth * currentScale
      const scaledHeight = canvasHeight * currentScale

      // Если изображение меньше контейнера, центрируем
      if (scaledWidth <= containerWidth) {
        x = -(containerWidth - scaledWidth) / 2
      } else {
        // Ограничиваем, чтобы не показывать края
        const maxX = 0
        const minX = containerWidth - scaledWidth
        x = Math.max(minX, Math.min(maxX, x))
      }

      if (scaledHeight <= containerHeight) {
        y = -(containerHeight - scaledHeight) / 2
      } else {
        const maxY = 0
        const minY = containerHeight - scaledHeight
        y = Math.max(minY, Math.min(maxY, y))
      }

      return { x, y }
    },
    []
  )

  // Зум с ограничением позиции
  const handleZoom = useCallback(
    (zoomIn: boolean) => {
      setScale(prevScale => {
        const newScale = zoomIn
          ? Math.min(prevScale + zoomStep, maxScale)
          : Math.max(prevScale - zoomStep, minScale)

        // Пересчитываем позицию с учетом нового масштаба
        const container = containerRef.current
        if (!container) return newScale

        const rect = container.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Преобразуем координаты центра в мировые
        const worldX = (centerX - position.x) / prevScale
        const worldY = (centerY - position.y) / prevScale

        // Вычисляем новую позицию для сохранения центра
        const newX = centerX - worldX * newScale
        const newY = centerY - worldY * newScale

        // Ограничиваем позицию
        const clamped = clampPosition(newX, newY, newScale)
        setPosition(clamped)

        return newScale
      })
    },
    [position, clampPosition]
  )

  const handleZoomIn = () => handleZoom(true)
  const handleZoomOut = () => handleZoom(false)

  const handleResetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Панорамирование
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      setIsPanning(true)
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return

    const newX = e.clientX - startPos.x
    const newY = e.clientY - startPos.y

    const clamped = clampPosition(newX, newY, scale)
    setPosition(clamped)
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "800px",
        height: "800px",
        bgcolor: "black",
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
        cursor: isPanning ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Контейнер с трансформацией */}
      <Box
        sx={{
          position: "absolute",
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url(/src/assets/map.png)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            pointerEvents: "none",
            userSelect: "none",
          }}
        ></div>
      </Box>

      {/* Кнопки управления */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <ButtonGroup
          orientation="vertical"
          variant="contained"
          size="small"
        >
          <Button
            onClick={handleZoomIn}
            title="Увеличить"
            disabled={scale >= maxScale}
          >
            +
          </Button>
          <Button
            onClick={handleZoomOut}
            title="Уменьшить"
            disabled={scale <= minScale}
          >
            -
          </Button>
          <Button
            onClick={handleResetView}
            title="Сбросить вид"
          >
            ресет
          </Button>
        </ButtonGroup>
      </Box>

      {/* Индикатор масштаба */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          bgcolor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "4px 12px",
          borderRadius: 1,
          fontSize: "14px",
        }}
      >
        Масштаб: {Math.round(scale * 100)}%
      </Box>
    </Box>
  )
}

export default Map
