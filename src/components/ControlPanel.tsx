import { Paper, Slider, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { SIMULATION } from "../constants"
import { convertSeconds } from "../lib/convertSeconds"
import type { MapOptions } from "../types"
import { ControlButton } from "./ControlButton"

interface ControlPanelProps {
  onSubmit: (options: MapOptions) => void
}

const ControlPanel: React.FC<ControlPanelProps> = observer(({ onSubmit }) => {
  const [count, setCount] = useState<number>(SIMULATION.TARGETS.DEFAULT)
  const [speed, setSpeed] = useState<number>(SIMULATION.SPEED.DEFAULT)
  const [offlineTimeout, setOfflineTimeout] = useState<number>(60)
  const [latency, setLatency] = useState<number>(SIMULATION.LATENCY.DEFAULT)
  const [fps, setFps] = useState<number>(10)

  const handleOfflineTimeoutChange = (
    _: Event,
    newValue: number | number[]
  ) => {
    setOfflineTimeout(newValue as number)
  }

  const handleTargetCountChange = (_: Event, newValue: number | number[]) => {
    setCount(newValue as number)
  }

  const handleSpeedChange = (_: Event, newValue: number | number[]) => {
    setSpeed(newValue as number)
  }

  const handleLatencyChange = (_: Event, newValue: number | number[]) => {
    setLatency(newValue as number)
  }

  const handleFpsChange = (_: Event, newValue: number | number[]) => {
    setFps(newValue as number)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      count,
      speed,
      offlineTimeout: offlineTimeout * 1000,
      latency,
      fps,
    })
  }

  return (
    <Paper
      component="form"
      sx={{
        width: "100%",
        py: 1,
        px: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      onSubmit={handleSubmit}
    >
      <Stack
        direction="row"
        alignItems="center"
        width="100%"
        gap={4}
      >
        <Stack
          direction="row"
          alignItems="center"
          flex={1}
          gap={3}
        >
          <Stack flex={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              Targets: {count}
            </Typography>
            <Slider
              size="small"
              step={10}
              min={SIMULATION.TARGETS.MIN}
              max={SIMULATION.TARGETS.MAX}
              value={count}
              onChange={handleTargetCountChange}
            />
          </Stack>

          <Stack flex={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              Speed: {speed}
            </Typography>
            <Slider
              size="small"
              step={10}
              min={SIMULATION.SPEED.MIN}
              max={SIMULATION.SPEED.MAX}
              value={speed}
              onChange={handleSpeedChange}
            />
          </Stack>

          <Stack flex={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              Offline: {convertSeconds(offlineTimeout)}
            </Typography>
            <Slider
              size="small"
              step={10}
              min={10}
              max={300}
              value={offlineTimeout}
              onChange={handleOfflineTimeoutChange}
              valueLabelDisplay="auto"
              valueLabelFormat={convertSeconds}
            />
          </Stack>

          <Stack flex={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              Latency: {latency}
            </Typography>
            <Slider
              size="small"
              step={10}
              min={SIMULATION.LATENCY.MIN}
              max={SIMULATION.LATENCY.MAX}
              value={latency}
              onChange={handleLatencyChange}
            />
          </Stack>

          <Stack flex={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              FPS: {fps}
            </Typography>
            <Slider
              size="small"
              step={1}
              min={1}
              max={25}
              value={fps}
              onChange={handleFpsChange}
            />
          </Stack>
        </Stack>

        <Stack width="20%">
          <ControlButton />
        </Stack>
      </Stack>
    </Paper>
  )
})

export default ControlPanel
