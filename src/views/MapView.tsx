import { Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import ControlPanel from "../components/ControlPanel"
import Map from "../components/Map"
import { useStores } from "../hooks/useStores"

export interface MapOptions {
  targetCount: number
  speed: number
  offlineTimeout: number
}

const MapView = observer(() => {
  const { targetsStore } = useStores()

  // const [targets, setTargets] = useState<Target[]>([])
  // const [isRunning, setIsRunning] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  // const intervalRef = useRef<number | null>(null)

  // const startServer = async () => {
  //   if (isRunning) return

  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     const result = await start(5, 10) // 5 targets, speed 10
  //     if (result.success) {
  //       setIsRunning(true)
  //       startPolling()
  //     } else {
  //       setError(result.error || "Failed to start server")
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Unknown error occurred")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const stopServer = () => {
  //   stop()
  //   setIsRunning(false)
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current)
  //     intervalRef.current = null
  //   }
  // }

  // const startPolling = () => {
  //   // Clear any existing interval
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current)
  //   }

  //   // Initial fetch
  //   fetchTargets()

  //   // Set up polling
  //   intervalRef.current = setInterval(fetchTargets, 500)
  // }

  // const fetchTargets = async () => {
  //   try {
  //     const result = await getTargets()
  //     if (result.success) {
  //       setTargets(prev => {
  //         const newTargets = result.data || []
  //         return JSON.stringify(prev) === JSON.stringify(newTargets)
  //           ? prev
  //           : newTargets
  //       })
  //     }
  //   } catch (err) {
  //     console.error("Error fetching targets:", err)
  //   }
  // }

  // // Cleanup on unmount
  // useEffect(() => {
  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current)
  //     }
  //   }
  // }, [])

  const handleSubmit = (options: MapOptions) => {
    console.log("Map options", options)

    if (targetsStore.serverIsRunning) {
      targetsStore.setServerIsRunning(false)
    } else {
      targetsStore.setServerIsRunning(true)
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
