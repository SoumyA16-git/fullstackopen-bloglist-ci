import { Box, TextField, Button, Typography } from '@mui/material'

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => {
  return (
    <Box sx={{ maxWidth: 400, margin: '2rem auto' }}>
      <Typography variant="h4" gutterBottom>
        Log in to application
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          id="username"
          label="username:"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          id="password"
          label="password:"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
