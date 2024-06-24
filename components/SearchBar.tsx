import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const SearchBar = ({ setSearchQuery }: any) => (
  <form
    style={{
      width: "100%",
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <FormControl
      variant="outlined"
      margin="normal"
      sx={{
        width: { xs: "80%", md: "25%" },
        mt: { xs: 12, md: 15 },
        zIndex: 999,
        backgroundColor: "white",
        borderRadius: 25,
      }}
    >
      <OutlinedInput
        id="search-bar"
        placeholder="Buscar..."
        onChange={(e) => setSearchQuery(e.target.value)}
        endAdornment={<SearchIcon style={{ fill: "gray" }} />}
        sx={{
          borderRadius: 25,
        }}
      />
    </FormControl>
  </form>
);
