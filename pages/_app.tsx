import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import "../styles/globals.css";
import theme from "../components/theme";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const TokenContext = createContext<string | null>(null);

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("orienteering-me-token");
    if (token) {
      if (jwtDecode(token).exp! * 1000 < new Date().getTime()) {
        localStorage.removeItem("orienteering-me-token");
        setToken("");
      } else {
        setToken(token);
      }
    } else {
      setToken("");
    }
  }, []);

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth={false} disableGutters>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TokenContext.Provider value={token}>
              <ResponsiveAppBar></ResponsiveAppBar>
              <Component {...pageProps} />
            </TokenContext.Provider>
          </Box>
        </Container>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
