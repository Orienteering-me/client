import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../components/Link";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import dynamic from "next/dynamic";

const OpenStreetMap = dynamic(() => import("../components/OpenStreetMap"), {
  ssr: false,
});

export default function Account() {
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
