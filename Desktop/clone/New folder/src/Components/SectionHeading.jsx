import React from 'react'
import { Typography } from '@mui/material'

const SectionHeading = ({children}) => {
  return (
    <Typography variant="h4" component="h4" sx={{color: 'primary.main', fontWeight: "bold", lineHeight: "125%", letterSpacing: "0.25px"}}>
      {children}
    </Typography>
  )
}

export default SectionHeading