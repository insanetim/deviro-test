import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { ACCESS_CODE } from "../constants"
import { useStores } from "../hooks/useStores"

const AuthView = observer(() => {
  const { authStore } = useStores()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === ACCESS_CODE) {
      authStore.login()
      setError("")
    } else {
      setError("Invalid access code. Please try again.")
    }
  }

  return (
    <Card
      sx={{
        maxWidth: 500,
        width: "100%",
        boxShadow: "0 0 15px rgba(66, 165, 245, 0.3)",
        "&:hover": {
          boxShadow: "0 0 20px rgba(66, 165, 245, 0.4)",
        },
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 3, fontWeight: "medium" }}
        >
          Authorization
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Please enter your unique access code (
          <Box
            component="span"
            sx={{ fontWeight: "bold" }}
          >
            {ACCESS_CODE}
          </Box>
          ) to continue.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            label="Access Code"
            variant="outlined"
            value={code}
            onChange={e => setCode(e.target.value)}
            margin="normal"
            placeholder="Enter your access code"
            error={!!error}
            helperText={error}
            autoComplete="off"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={!code.trim()}
            sx={{
              mt: 3,
              py: 1.5,
              textTransform: "none",
              cursor: "pointer",
              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "text.disabled",
              },
            }}
          >
            Continue
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
})

export default AuthView
