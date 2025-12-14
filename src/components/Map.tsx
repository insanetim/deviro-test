import { Box, Button, ButtonGroup } from "@mui/material"
import { useCallback, useRef, useState } from "react"

const Map = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  // Единые размеры для всего
  const size = 800
  const minScale = 0.5
  const maxScale = 5
  const zoomStep = 0.2

  // Ограничение позиции, чтобы не показывать фон
  const clampPosition = useCallback(
    (x: number, y: number, currentScale: number) => {
      // Размер карты с учетом масштаба
      const scaledSize = size * currentScale

      // 1. Если карта МЕНЬШЕ контейнера → центрируем
      if (scaledSize <= size) {
        const centered = (size - scaledSize) / 2
        return { x: centered, y: centered }
      }

      // 2. Если карта БОЛЬШЕ контейнера → ограничиваем панорамирование
      // Вычисляем границы перемещения
      const minOffset = size - scaledSize // отрицательное значение
      const clampedX = Math.max(minOffset, Math.min(0, x))
      const clampedY = Math.max(minOffset, Math.min(0, y))

      return { x: clampedX, y: clampedY }
    },
    [size]
  )

  // Зум с ограничением позиции
  const handleZoom = useCallback(
    (zoomIn: boolean) => {
      setScale(prevScale => {
        const newScale = zoomIn
          ? Math.min(prevScale + zoomStep, maxScale)
          : Math.max(prevScale - zoomStep, minScale)

        // Если контейнер еще не доступен, просто меняем scale
        if (!containerRef.current) return newScale

        // Центр контейнера
        const center = size / 2

        // Преобразуем координаты центра контейнера в мировые координаты карты
        const worldCoord = (center - position.x) / prevScale

        // Вычисляем новую позицию для сохранения этой точки в центре
        const newPos = center - worldCoord * newScale

        // Ограничиваем позицию
        const clamped = clampPosition(newPos, newPos, newScale)
        setPosition(clamped)

        return newScale
      })
    },
    [position, clampPosition, size]
  )

  const handleZoomIn = () => handleZoom(true)
  const handleZoomOut = () => handleZoom(false)

  const handleResetView = () => {
    // При сбросе центрируем карту
    const clamped = clampPosition(0, 0, 1)
    setScale(1)
    setPosition(clamped)
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
        width: `${size}px`,
        height: `${size}px`,
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
          width: `${size}px`,
          height: `${size}px`,
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
            WebkitUserSelect: "none",
            msUserSelect: "none",
          }}
        />
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
            reset
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
