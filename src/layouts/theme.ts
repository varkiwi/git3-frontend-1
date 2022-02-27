import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6b7280",
    },
    secondary: {
      main: "#14FFEC",
    },
    text: {
      primary: "#ffffff",
      secondary: "#c7c7c7",
    },
    background: {
      default: "#282828",
    },
  },
  typography: {
    allVariants: {
      color: "#ffffff",
    },
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h1: {
      fontSize: 30,
      fontWeight: 700,
    },
    h2: {
      fontSize: 20,
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      fontWeight: 500,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-focused": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: 14,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
        },
      },
    },
  },
});
