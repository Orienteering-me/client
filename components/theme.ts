import { Montserrat } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#ef8630",
    },
    secondary: {
      main: "#ffffff",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
    fontSize: 16,
  },
});

export default theme;
