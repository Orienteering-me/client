import {
  Alert,
  Card,
  CardActions,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

interface UploadImageCardProps {
  image: File;
  valid: boolean | null;
  msg: string;
}

export function UploadImageCard({ image, valid, msg }: UploadImageCardProps) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia sx={{ height: 350 }} image={URL.createObjectURL(image!)} />
        {valid == null ? (
          <></>
        ) : (
          <CardActions sx={{ p: 0 }}>
            {valid ? (
              <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
                <Typography>{msg}</Typography>
              </Alert>
            ) : (
              <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
                <Typography>{msg}</Typography>
              </Alert>
            )}
          </CardActions>
        )}
      </Card>
    </Grid>
  );
}
