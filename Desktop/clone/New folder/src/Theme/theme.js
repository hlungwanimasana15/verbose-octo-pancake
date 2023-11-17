import { createTheme } from "@mui/material";

export const theme = createTheme({
    spacing: [2, 4, 8, 16, 32, 64],
    typography: {
      fontFamily: '"Poppins", sans-serif'
    },
    palette: {
      primary: {
        main: '#1C3F53',
        light: '#396781',
      },
      secondary: {
        main: '#E3ECF1',
        dark: '#DBF7FF'
      },
      warning: {
        main: '#FF6347'
      },
      greys: {
        main: '#C6D0D6',
        dark: '#B3B3B3'
      },
      links: {
        main:  '#B8EFFF'
      }
    },
  })


