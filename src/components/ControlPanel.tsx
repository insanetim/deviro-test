import { Paper, Slider, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import type { MapOptions } from "../types"
import { ControlButton } from "./ControlButton"

interface ControlPanelProps {
  onSubmit: (options: MapOptions) => void
}

const ControlPanel: React.FC<ControlPanelProps> = observer(({ onSubmit }) => {
  const [count, setCount] = useState<number>(100)
  const [speed, setSpeed] = useState<number>(10)
  const [offlineTimeout, setOfflineTimeout] = useState<number>(10)

  const handleOfflineTimeoutChange = (
    _: Event,
    newValue: number | number[]
  ) => {
    setOfflineTimeout(newValue as number)
  }

  const formatOfflineTimeout = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }

  const handleTargetCountChange = (_: Event, newValue: number | number[]) => {
    setCount(newValue as number)
  }

  const handleSpeedChange = (_: Event, newValue: number | number[]) => {
    setSpeed(newValue as number)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      count,
      speed,
      offlineTimeout: offlineTimeout * 1000,
    })
  }

  return (
    <Paper
      component="form"
      sx={{ width: "100%", p: 2 }}
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
              step={1}
              min={1}
              max={200}
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
              step={1}
              min={1}
              max={20}
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
              Offline timeout: {formatOfflineTimeout(offlineTimeout)}
            </Typography>
            <Slider
              size="small"
              step={10}
              min={10}
              max={300}
              value={offlineTimeout}
              onChange={handleOfflineTimeoutChange}
              valueLabelDisplay="auto"
              valueLabelFormat={formatOfflineTimeout}
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
