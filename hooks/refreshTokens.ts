import axios from "axios";

export async function refreshTokens(auth: any, errorContext: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/refresh`,
      {},
      {
        headers: {
          "Refresh-Token": auth.refreshToken,
        },
      }
    );
    if (response.status == 200) {
      auth.setAccessToken(response.data.access_token);
      auth.setRefreshToken(response.data.refresh_token);
      sessionStorage.setItem(
        "orienteering-me-access-token",
        response.data.access_token
      );
      localStorage.setItem(
        "orienteering-me-refresh-token",
        response.data.refresh_token
      );
    }
  } catch (error) {
    console.log(error);
    auth.setAccessToken("");
    auth.setRefreshToken("");
    sessionStorage.removeItem("orienteering-me-access-token");
    localStorage.removeItem("orienteering-me-refresh-token");
    if (error.response.status == 404) {
      errorContext.setError("La cuenta actual no existe.");
    } else if (error.response.status == 401) {
      errorContext.setError("");
    } else {
      errorContext.setError(
        "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
      );
    }
  }
}
