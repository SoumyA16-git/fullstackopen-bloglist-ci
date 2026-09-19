import { useState } from 'react'
import { Button, Box } from '@mui/material'

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  return (
    <Box>
      <Box style={hideWhenVisible}>
        <Button variant="contained" onClick={() => setVisible(true)}>
          {buttonLabel}
        </Button>
      </Box>

      <Box style={showWhenVisible}>
        {children}

        <Box sx={{ marginTop: 2 }}>
          <Button variant="outlined" onClick={() => setVisible(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Togglable
