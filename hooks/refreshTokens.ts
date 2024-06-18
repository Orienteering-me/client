import axios from "axios";

export async function refreshTokens(authContext: any, errorContext: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/refresh`,
      {},
      {
        headers: {
          "Refresh-Token": authContext.refreshToken,
        },
      }
    );
    if (response.status == 200) {
      sessionStorage.setItem(
        "orienteering-me-access-token",
        response.data.access_token
      );
      localStorage.setItem(
        "orienteering-me-refresh-token",
        response.data.refresh_token
      );
      authContext.setAccessToken(response.data.access_token);
      authContext.setRefreshToken(response.data.refresh_token);
    }
  } catch (error) {
    console.log(error);
    if (error.response.status == 401) {
      sessionStorage.removeItem("orienteering-me-access-token");
      localStorage.removeItem("orienteering-me-refresh-token");
      authContext.setAccessToken("");
      authContext.setRefreshToken("");
    } else if (error.response.status == 404) {
      errorContext.setError("La cuenta actual no existe.");
    } else {
      errorContext.setError(
        "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
      );
    }
  }
}
