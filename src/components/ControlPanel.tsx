import { Button, Paper, Slider, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { useStores } from "../hooks/useStores"
import type { MapOptions } from "../views/MapView"

interface ControlPanelProps {
  onSubmit: (options: MapOptions) => void
}

const ControlPanel: React.FC<ControlPanelProps> = observer(({ onSubmit }) => {
  const { targetsStore } = useStores()
  const [targetCount, setTargetCount] = useState<number>(100)
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
    setTargetCount(newValue as number)
  }

  const handleSpeedChange = (_: Event, newValue: number | number[]) => {
    setSpeed(newValue as number)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      targetCount,
      speed,
      offlineTimeout: offlineTimeout * 1000,
    })
  }

  return (
    <Paper
      component="form"
      elevation={2}
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
              Targets: {targetCount}
            </Typography>
            <Slider
              size="small"
              step={1}
              min={1}
              max={200}
              value={targetCount}
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
          <Button
            type="submit"
            variant={targetsStore.serverIsRunning ? "outlined" : "contained"}
            color="primary"
            fullWidth
            size="large"
            sx={{ fontWeight: "bold" }}
          >
            {targetsStore.serverIsRunning ? "Stop" : "Start"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
})

export default ControlPanel
