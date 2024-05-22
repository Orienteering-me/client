import { Cancel, CheckCircle } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import jsQR from "jsqr";
import { useContext, useState } from "react";
import { ImagesDataContext } from "../pages/course/run";
import exifr from "exifr";

interface UploadImageCardProps {
  index: number;
}

export function UploadImageCard({ index }: UploadImageCardProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [qrDecoded, setQrDecoded] = useState<string>("");
  const { qrCodes, setQrCodes, locations, setLocations, dates, setDates } =
    useContext(ImagesDataContext);

  async function processImage(file: File) {
    setSelectedImage(file);
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (event: ProgressEvent) => {
      const img: HTMLImageElement = new Image();
      img.onload = () => {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        const width: number = img.width;
        const height: number = img.height;

        canvas.width = width;
        canvas.height = height;

        const canvasRenderingContext: CanvasRenderingContext2D =
          canvas.getContext("2d")!;
        canvasRenderingContext.drawImage(img, 0, 0);
        const qrCodeImageFormat: ImageData =
          canvasRenderingContext.getImageData(0, 0, width, height);
        let qr_decoded = jsQR(
          qrCodeImageFormat.data,
          qrCodeImageFormat.width,
          qrCodeImageFormat.height
        );
        if (qr_decoded == null) {
          setQrDecoded("");
          setQrCodes(
            qrCodes.map(function (item, i) {
              if (i == index) {
                return "";
              } else {
                return item;
              }
            })
          );
        } else {
          setQrCodes(
            qrCodes.map(function (item, i) {
              if (i == index) {
                return qr_decoded.data;
              } else {
                return item;
              }
            })
          );
        }
        setDates(
          dates.map(function (item, i) {
            if (i == index) {
              return new Date(file.lastModified);
            } else {
              return item;
            }
          })
        );
        canvas.remove();
      };
      img.onerror = () => console.error("Upload file of image format please.");
      img.src = URL.createObjectURL(file);
    };
    const location = await exifr.gps(URL.createObjectURL(file));
    setLocations(
      locations.map(function (item, i) {
        if (i == index) {
          return { lat: location.latitude, lng: location.longitude };
        } else {
          return item;
        }
      })
    );
    console.log(dates);
    console.log(locations);
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia
          sx={{ height: 350 }}
          image={
            Boolean(selectedImage)
              ? URL.createObjectURL(selectedImage!)
              : "/default_image.svg"
          }
        />
        <CardActions>
          <Grid container>
            <Grid item xs={10}>
              <Button fullWidth variant="outlined" component="label">
                Elegir imagen
                <input
                  type="file"
                  hidden
                  accept=".png, .jpg, .jpeg"
                  onChange={(event) => {
                    processImage(event.target!.files![0]);
                  }}
                />
              </Button>
            </Grid>
            <Grid
              item
              xs={2}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {Boolean(selectedImage) ? (
                Boolean(qrDecoded) ? (
                  <CheckCircle style={{ color: "#4CAF50" }} />
                ) : (
                  <Cancel style={{ color: "red" }} />
                )
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      <Alert variant="filled" severity="error">
        <Typography>Error en la imagen</Typography>
      </Alert>
    </Grid>
  );
}
