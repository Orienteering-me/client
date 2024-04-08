import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import dynamic from "next/dynamic";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <Container maxWidth="lg" style={{ width: "100%" }}>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveAppBar></ResponsiveAppBar>
        <OpenStreetMap />
      </Box>
    </Container>
  );
}
