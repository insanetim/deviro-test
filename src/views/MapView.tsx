import { useEffect, useRef, useState } from "react"
import { getTargets, start, stop } from "../server/mockServer"
import type { Target } from "../types"

const MapView = () => {
  const [targets, setTargets] = useState<Target[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  const startServer = async () => {
    if (isRunning) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await start(5, 10) // 5 targets, speed 10
      if (result.success) {
        setIsRunning(true)
        startPolling()
      } else {
        setError(result.error || "Failed to start server")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const stopServer = () => {
    stop()
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startPolling = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial fetch
    fetchTargets()

    // Set up polling
    intervalRef.current = setInterval(fetchTargets, 500)
  }

  const fetchTargets = async () => {
    try {
      const result = await getTargets()
      if (result.success) {
        setTargets(prev => {
          const newTargets = result.data || []
          return JSON.stringify(prev) === JSON.stringify(newTargets)
            ? prev
            : newTargets
        })
      }
    } catch (err) {
      console.error("Error fetching targets:", err)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <h2>Map View</h2>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={startServer}
          disabled={isRunning || isLoading}
          style={{
            padding: "8px 16px",
            backgroundColor: isRunning
              ? "#4CAF50"
              : isLoading
              ? "#9E9E9E"
              : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning || isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading
            ? "Starting..."
            : isRunning
            ? "Server Running"
            : "Start Server"}
        </button>

        {isRunning && (
          <button
            onClick={stopServer}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Stop Server
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#FFEBEE",
          }}
        >
          {error}
        </div>
      )}

      <p>Server status: {isRunning ? "Running" : "Stopped"}</p>

      <div>
        <h3>Targets ({targets.length}):</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {targets.length > 0 ? (
            targets.map(target => (
              <div
                key={target.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "4px",
                  minWidth: "200px",
                }}
              >
                <div>
                  <strong>ID:</strong> {target.id?.substring(0, 8)}...
                </div>
                <div>
                  <strong>Position:</strong> ({target.x?.toFixed(1)},{" "}
                  {target.y?.toFixed(1)})
                </div>
                <div>
                  <strong>Speed:</strong> {target.speed?.toFixed(1)}
                </div>
                <div>
                  <strong>Angle:</strong> {target.angle?.toFixed(1)}°
                </div>
              </div>
            ))
          ) : (
            <div>No targets available. Start the server to see targets.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapView
