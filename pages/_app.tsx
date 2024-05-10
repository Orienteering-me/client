import Head from "next/head";
import { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import "../styles/globals.css";

import theme from "../components/theme";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth={false}
          disableGutters
          sx={{ backgroundColor: "#FFDFC8", height: "100vh" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ResponsiveAppBar></ResponsiveAppBar>
            <Component {...pageProps} />
          </Box>
        </Container>
      </ThemeProvider>
    </AppCacheProvider>
  );
}
