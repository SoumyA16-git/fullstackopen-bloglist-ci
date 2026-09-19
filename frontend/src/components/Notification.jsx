import { Alert, Box } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Box sx={{ margin: 2 }}>
      <Alert severity="info">
        {message}
      </Alert>
    </Box>
  )
}

export default Notification