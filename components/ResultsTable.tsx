import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Row {
  user: string;
  time: number;
}

interface ResultsTableProps {
  rows: Row[];
  sx: any;
}

export default function ResultsTable({ rows, sx }: ResultsTableProps) {
  return (
    <TableContainer sx={sx} component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="results table">
        <TableHead>
          <TableRow>
            <TableCell>Posición</TableCell>
            <TableCell align="right">Nombre</TableCell>
            <TableCell align="right">Tiempo final</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const hours = Math.floor(row.time / 3600000);
            const minutes = Math.floor(row.time / 60000);
            const seconds = Math.floor(row.time / 1000);

            return (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{row.user}</TableCell>
                <TableCell align="right">
                  {row.time > -1
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
      </Table>
    </TableContainer>
  );
}
