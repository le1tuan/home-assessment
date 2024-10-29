import { Box, CircularProgress } from "@mui/material";


export const Loading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 999,
        opacity: '0.5',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress />
    </Box>
  )
}