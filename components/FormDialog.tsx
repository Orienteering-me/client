import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

export default function AlertDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = async () => {
    const token = localStorage.getItem("orienteering-me-token");
    handleClose();

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URI}/users`,
        {
          headers: {
            "orienteering-me-token": token,
          },
        }
      );

      if (response.status == 200) {
        alert("La cuenta ha sido eliminada correctamente.");
        setToken("");
        localStorage.removeItem("orienteering-me-token");
        router.push(".");
      } else {
        alert(
          "Ha ocurrido un error inesperado. Por favor, inténtelo más tarde."
        );
      }
    } catch (error) {
      if (error.response.status == 401) {
        alert("No tienes permisos para acceder a este recurso.");
      } else if (error.response.status == 404) {
        alert("La cuenta actual no existe.");
      } else {
        alert(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        style={{
          marginTop: 15,
          marginBottom: 5,
          color: "white",
          backgroundColor: "red",
          fontWeight: 700,
        }}
        onClick={handleClickOpen}
      >
        Borrar cuenta
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Está seguro de que quiere borrar su cuenta?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteUser}>Aceptar</Button>
          <Button onClick={handleClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
