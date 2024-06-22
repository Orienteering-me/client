import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import "../styles/globals.css";
import theme from "../components/theme";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { createContext, useEffect, useState } from "react";
import ErrorAlert from "../components/ErrorAlert";
import { AuthContextType } from "../types/AuthContextType";
import { ErrorContextType } from "../types/ErrorContextType";

export const AuthContext = createContext<AuthContextType>({
  refreshToken: null,
  setRefreshToken: () => {},
  accessToken: null,
  setAccessToken: () => {},
});

export const ErrorContext = createContext<ErrorContextType>({
  error: "",
  setError: () => {},
});

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (refreshToken == null) {
      setRefreshToken(
        localStorage.getItem("orienteering-me-refresh-token") || ""
      );
    }
    if (accessToken == null) {
      setAccessToken(
        sessionStorage.getItem("orienteering-me-access-token") || ""
      );
    }
  }, []);

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Orienteering.me</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth={false} disableGutters>
          <ErrorAlert
            open={Boolean(error)}
            error={error}
            onClose={() => setError("")}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ErrorContext.Provider value={{ error, setError }}>
              <AuthContext.Provider
                value={{
                  refreshToken,
                  setRefreshToken,
                  accessToken,
                  setAccessToken,
                }}
              >
                <ResponsiveAppBar></ResponsiveAppBar>
                <Component {...pageProps} />
              </AuthContext.Provider>
            </ErrorContext.Provider>
          </Box>
        </Container>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
