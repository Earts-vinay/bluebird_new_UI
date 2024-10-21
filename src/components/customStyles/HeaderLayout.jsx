import { Box } from '@mui/material'
import React from 'react'

const HeaderLayout = ({children,padding}) => {
  return (
    <Box
    sx={{
      backgroundColor:
        "linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)",
      height: "82vh !important",
      padding:padding,
      borderRadius: "10px",
      overflow: "hidden",
      backdropFilter: "blur(15px)",
      position: "relative",
      boxShadow: " 0 0 5px 0 rgb(0 58 111 / 49%)",
      marginTop:"25px"
    }}
  >
    {children}
    </Box>
  )
}

export default HeaderLayout