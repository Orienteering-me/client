import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";

const pages = [
  { text: "Iniciar sesión", route: "login" },
  { text: "Registrarme", route: "register" },
];

const authenticatedPages = [
  { text: "Mi cuenta", route: "account" },
  { text: "Carreras favoritas", route: "saved_courses" },
  { text: "Crear carrera", route: "new_course" },
  { text: "Carreras creadas", route: "created_courses" },
  { text: "Cerrar sesión", route: "logout" },
];

function ResponsiveAppBar() {
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setAuthenticated(token != null);
  }, []);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="a" href="." sx={{ display: "flex", mr: 1 }}>
            <Box
              component="img"
              sx={{
                height: { xs: 48, md: 64 },
              }}
              alt="Orienteering.me"
              src={"logo-icon.svg"}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="."
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ORIENTEERING.ME
          </Typography>

          <Typography
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ORIENTEERING.ME
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Account" src="default_avatar.png" />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {authenticated
                ? authenticatedPages.map((page) => (
                    <MenuItem
                      key={page.text}
                      onClick={handleCloseUserMenu}
                      component="a"
                      href={page.route}
                    >
                      <Typography textAlign="center">{page.text}</Typography>
                    </MenuItem>
                  ))
                : pages.map((page) => (
                    <MenuItem
                      key={page.text}
                      onClick={handleCloseUserMenu}
                      component="a"
                      href={page.route}
                    >
                      <Typography textAlign="center">{page.text}</Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
