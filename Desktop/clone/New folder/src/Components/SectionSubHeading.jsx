import React from 'react'
import { Typography } from '@mui/material'

const SectionSubHeading = ({children}) => {
  return (
    <Typography variant="h6" sx={{color: 'primary.light', fontWeight: "400"}}>
      {children}
    </Typography>
  )
}

export default SectionSubHeading