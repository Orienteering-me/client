import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";

const CardsMap = dynamic(() => import("../components/maps/CardsMap"), {
  ssr: false,
});

export interface CreatedCourseCardProps {
  name: string;
  lat: number;
  lng: number;
}

export function CreatedCourseCard({ name, lat, lng }: CreatedCourseCardProps) {
  return (
    <Card>
      <CardMedia
        sx={{
          height: 250,
        }}
      >
        <CardsMap lat={lat} lng={lng} />
      </CardMedia>
      <CardContent>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          href={"/course?name=" + name}
          style={{
            margin: 10,
            fontWeight: 700,
            color: "white",
          }}
          color="primary"
        >
          Ver información
        </Button>
      </CardActions>
    </Card>
  );
}
