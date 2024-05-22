import ForbiddenPage from "../components/ForbiddenPage";

export default function NotFound() {
  return (
    <ForbiddenPage
      title="Error 404"
      message="La página a la que intentas acceder no existe"
      button_href="/"
      button_text="Volver al inicio"
    />
  );
}
