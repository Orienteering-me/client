import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { refreshTokens } from "../hooks/refreshTokens";
import { AuthContext, ErrorContext } from "../pages/_app";
import axios from "axios";

interface TableData {
  id: string;
  position: string;
  name: string;
  total_time: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof TableData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "position",
    numeric: false,
    label: "Posición",
  },
  {
    id: "name",
    numeric: false,
    label: "Nombre",
  },
  {
    id: "total_time",
    numeric: true,
    label: "Tiempo total",
  },
];

interface ResultsTableHeadProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function ResultsTableHead(props: ResultsTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface CheckpointTimes {
  user: { email: string; name: string };
  times: { number: number; time: number }[] | null;
}

interface ResultsTableProps {
  rows: TableData[];
  checkpoint_times: CheckpointTimes[];
  course: string;
  is_admin: boolean;
}

export default function ResultsTable({
  rows,
  checkpoint_times,
  course,
  is_admin,
}: ResultsTableProps) {
  const auth = React.useContext(AuthContext);
  const errorContext = React.useContext(ErrorContext);

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TableData>("position");
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [rowDetails, setRowDetails] = React.useState<CheckpointTimes>({
    user: { email: "", name: "" },
    times: [{ number: -1, time: Number.MAX_SAFE_INTEGER }],
  });
  let times_sum = 0;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const orderedRows = React.useMemo(
    () => rows.slice().sort(getComparator(order, orderBy)),
    [order, orderBy]
  );

  async function deleteUserTimes(course: string, email: string) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URI}/times?course=` +
          course +
          "&email=" +
          email,
        {
          headers: {
            "Access-Token": auth.accessToken,
          },
        }
      );
      if (response.status == 200) {
        alert("Resultados eliminados correctamente.");
        window.location.reload();
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

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, mt: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-labelledby="tableTitle">
            <ResultsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {orderedRows.map((row) => {
                const date = new Date(row.total_time);
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const seconds = date.getSeconds();

                return (
                  <TableRow
                    key={row.id}
                    hover
                    tabIndex={-1}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setRowDetails(
                        checkpoint_times.filter((checkpoint_time) => {
                          return checkpoint_time.user.email == row.id;
                        })[0]
                      );
                      setOpenDialog(true);
                    }}
                  >
                    <TableCell align="left">{row.position}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="right">
                      {row.total_time != Number.MAX_SAFE_INTEGER
                        ? (hours < 10 ? "0" : "") +
                          hours +
                          ":" +
                          (minutes < 10 ? "0" : "") +
                          minutes +
                          ":" +
                          (seconds < 10 ? "0" : "") +
                          seconds
                        : "No califica"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <React.Fragment>
              <Dialog
                open={openDialog}
                onClose={() => {
                  setOpenDialog(false);
                }}
                aria-labelledby="alert-dialog-title"
              >
                <DialogTitle id="alert-dialog-title">
                  {rowDetails.user.name}
                </DialogTitle>
                <DialogContent>
                  {rowDetails.times == null ? (
                    <DialogContentText>
                      Error en la clasificación
                    </DialogContentText>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: { xs: 0, md: 550 } }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Punto de control</TableCell>
                            <TableCell />
                            <TableCell>Tiempo</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rowDetails.times.map((rowDetail, index, array) => {
                            const date =
                              index == 0
                                ? new Date(rowDetail.time)
                                : new Date(
                                    rowDetail.time - array[index - 1]!.time!
                                  );
                            const hours = date.getHours();
                            const minutes = date.getMinutes();
                            const seconds = date.getSeconds();
                            times_sum +=
                              index == 0
                                ? 0
                                : rowDetail.time - array[index - 1]!.time!;

                            return (
                              <TableRow
                                key={rowDetail.number}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {rowDetail.number + 1}
                                </TableCell>
                                <TableCell />
                                <TableCell component="th" scope="row">
                                  {(rowDetail.number == 0 ? "" : "+") +
                                    (hours < 10 ? "0" : "") +
                                    hours +
                                    ":" +
                                    (minutes < 10 ? "0" : "") +
                                    minutes +
                                    ":" +
                                    (seconds < 10 ? "0" : "") +
                                    seconds}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell />
                            <TableCell>Tiempo total</TableCell>
                            <TableCell>
                              {(new Date(times_sum).getHours() < 10
                                ? "0"
                                : "") +
                                new Date(times_sum).getHours() +
                                ":" +
                                (new Date(times_sum).getMinutes() < 10
                                  ? "0"
                                  : "") +
                                new Date(times_sum).getMinutes() +
                                ":" +
                                (new Date(times_sum).getSeconds() < 10
                                  ? "0"
                                  : "") +
                                new Date(times_sum).getSeconds()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DialogContent>
                <DialogActions>
                  {is_admin ? (
                    <Button
                      variant="outlined"
                      style={{
                        marginBottom: 5,
                        color: "white",
                        backgroundColor: "red",
                      }}
                      onClick={() => {
                        setOpenDialog(false);
                        deleteUserTimes(course, rowDetails.user.email).catch(
                          () => {
                            refreshTokens(auth, errorContext);
                          }
                        );
                      }}
                    >
                      Eliminar
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    style={{
                      marginBottom: 5,
                    }}
                    onClick={() => {
                      setOpenDialog(false);
                    }}
                    autoFocus
                  >
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
