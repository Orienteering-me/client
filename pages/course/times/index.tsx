import { useContext, useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import ForbiddenPage from "../../../components/ForbiddenPage";
import LoadingBox from "../../../components/LoadingBox";
import Link from "next/link";
import { AuthContext, ErrorContext } from "../../_app";
import { refreshTokens } from "../../../hooks/refreshTokens";
import ResultsTable from "../../../components/ResultsTable";

interface Result {
  user: {
    email: string;
    name: string;
  };
  total_time: number;
  checkpoint_times: { number: number; time: number }[] | null;
}

export default function Results({ course }: any) {
  const auth = useContext(AuthContext);
  const errorContext = useContext(ErrorContext);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [haveUploadedTimes, setHaveUploadedResults] = useState<boolean>(false);
  const [results, setResults] = useState<Result[] | null>(null);

  async function getRanking() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/times?course=` + course,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );
      if (response.status == 200) {
        const parsedResults = response.data.results
          .map((result: any) => {
            if (result.times != null) {
              // Sorts the checkpoints times by the checkpoint number
              result.times.sort((time1: any, time2: any) => {
                if (time1.checkpoint.number > time2.checkpoint.number) {
                  return 1;
                }
                if (time1.checkpoint.number < time2.checkpoint.number) {
                  return -1;
                }
                return 0;
              });
              return {
                course: result.course,
                user: {
                  email: result.user.email,
                  name: result.user.name,
                },
                total_time:
                  new Date(
                    result.times[result.times.length - 1].time
                  ).getTime() - new Date(result.times[0].time).getTime(),
                checkpoint_times: result.times.map((time: any) => {
                  return {
                    number: time.checkpoint.number,
                    time: new Date(time.time).getTime(),
                  };
                }),
              };
            } else {
              return {
                course: result.course,
                user: {
                  email: result.user.email,
                  name: result.user.name,
                },
                total_time: Number.MAX_SAFE_INTEGER,
                checkpoint_times: null,
              };
            }
          })
          .sort((result1: any, result2: any) => {
            // Sorts the results by the total time
            if (result1.total_time > result2.total_time) {
              return 1;
            }
            if (result1.total_time < result2.total_time) {
              return -1;
            }
            return 0;
          });
        setIsAdmin(response.data.is_admin);
        setHaveUploadedResults(response.data.has_uploaded);
        setResults(parsedResults);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 401) {
        throw Error("Permiso denegado.");
      } else if (error.response.status == 404) {
        errorContext.setError("Esta carrera no existe.");
      } else {
        errorContext.setError(
          "Ha ocurrido un error procesando la petición. Por favor, inténtelo más tarde."
        );
      }
    }
  }

  useEffect(() => {
    if (auth.refreshToken) {
      getRanking().catch(() => {
        refreshTokens(auth, errorContext);
      });
    }
  }, [auth]);

  if (auth.refreshToken == null) {
    return <LoadingBox />;
  } else if (auth.refreshToken == "") {
    return (
      <ForbiddenPage
        title="No has iniciado sesión o no tienes permiso"
        message="Quizás la sesión ha caducado. Prueba a iniciar sesión de nuevo."
        button_href="/login"
        button_text="Iniciar sesión"
      />
    );
  } else if (results != null && isAdmin != null && haveUploadedTimes != null) {
    return (
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        disableGutters
      >
        <Box
          sx={{
            mt: { xs: 12, md: 15 },
            mb: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
            padding: "2% 5%",
            backgroundColor: "#ffffff",
            width: { xs: "90%", md: "80%" },
            borderRadius: "25px",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Orienteering.me
            </Link>
            <Link color="inherit" href={"/course?name=" + course}>
              {course}
            </Link>
            <Typography color="text.primary">Ver resultados</Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{
              mt: 2,
              display: "flex",
              fontWeight: 700,
              letterSpacing: ".1rem",
            }}
          >
            Ver resultados
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              display: "flex",
              fontWeight: 700,
            }}
          >
            {course}
          </Typography>
          <ResultsTable
            rows={results.map((result, index) => {
              if (result.checkpoint_times == null) {
                return {
                  id: result.user.email,
                  position: "_",
                  name: result.user.name,
                  total_time: Number.MAX_SAFE_INTEGER,
                };
              } else {
                return {
                  id: result.user.email,
                  position: index + 1 + "",
                  name: result.user.name,
                  total_time: result.total_time,
                };
              }
            })}
            checkpoint_times={results.map((result) => {
              return {
                user: { email: result.user.email, name: result.user.name },
                times: result.checkpoint_times,
              };
            })}
            course={course}
            is_admin={isAdmin}
          />
          {isAdmin ? (
            <></>
          ) : (
            <Tooltip
              title={haveUploadedTimes ? "Ya has subido tus resultados" : ""}
            >
              <div>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={haveUploadedTimes}
                  style={{
                    marginTop: 25,
                    fontWeight: 700,
                    color: "white",
                  }}
                  href={"/course/times/upload?course=" + course}
                >
                  Subir resultados
                </Button>
              </div>
            </Tooltip>
          )}
        </Box>
      </Container>
    );
  } else {
    return <LoadingBox />;
  }
}

Results.getInitialProps = async ({ query }: any) => {
  const { course } = query;
  return { course };
};
