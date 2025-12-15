import { Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useCallback, useRef } from "react"
import ControlPanel from "../components/ControlPanel"
import Map from "../components/Map"
import { useStores } from "../hooks/useStores"
import type { MapOptions } from "../types"

// Polling interval in milliseconds
const POLLING_INTERVAL = 1000

const MapView = observer(() => {
  const { targetsStore } = useStores()
  const pollingIntervalRef = useRef<number | null>(null)

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [])

  const startPolling = useCallback(() => {
    // Clear any existing interval
    stopPolling()

    // Initial fetch
    targetsStore.fetchTargets().catch(console.error)

    // Set up polling
    pollingIntervalRef.current = window.setInterval(() => {
      targetsStore.fetchTargets().catch(console.error)
    }, POLLING_INTERVAL)
  }, [targetsStore, stopPolling])

  const handleSubmit = async (options: MapOptions) => {
    try {
      if (targetsStore.serverIsRunning) {
        stopPolling()
        await targetsStore.stopServer()
      } else {
        await targetsStore.startServer(options)
        startPolling()
      }
    } catch (error) {
      console.error("Error toggling server state:", error)
    }
  }

  return (
    <Stack
      direction="column"
      sx={{ py: 2 }}
      gap={1}
    >
      <ControlPanel onSubmit={handleSubmit} />
      <Map />
    </Stack>
  )
})

export default MapView
