import { MouseEvent, useContext, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../pages/_app";

const pages = [{ text: "Información", href: "info" }];

const menuItems = [
  { text: "Iniciar sesión", href: "/login" },
  { text: "Registrarme", href: "/register" },
];

const authenticatedMenuItems = [
  { text: "Mi cuenta", href: "/account" },
  { text: "Carreras favoritas", href: "/course/favourites" },
  { text: "Crear carrera", href: "/course/create" },
  { text: "Carreras creadas", href: "/course/created" },
  { text: "Cerrar sesión", href: "/logout" },
];

function ResponsiveAppBar() {
  const auth = useContext(AuthContext);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="absolute">
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            component="a"
            href="/"
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          >
            <Box
              component="img"
              sx={{
                height: 80,
                pb: 1,
              }}
              alt="Orienteering.me"
              src={"/logo-icon.svg"}
            />
          </Box>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ORIENTEERING.ME
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="pages"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="secondary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.text}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={page.href}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    {page.text}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            component="a"
            href="/"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Box
              component="img"
              sx={{
                height: 48,
                pb: 0.5,
              }}
              alt="Orienteering.me"
              src={"/logo-icon.svg"}
            />
          </Box>
          <Typography
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ORIENTEERING.ME
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                onClick={handleCloseNavMenu}
                sx={{
                  mr: 2,
                  my: 2,
                  color: "white",
                  display: "block",
                  fontSize: 20,
                }}
                href={page.href}
              >
                {page.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir menú">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                <Avatar alt="Avatar" src="/default_avatar.png" />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "bottom",
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
              {Boolean(auth.refreshToken)
                ? authenticatedMenuItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={handleCloseUserMenu}
                      component="a"
                      href={item.href}
                    >
                      <Typography
                        textAlign="center"
                        sx={{
                          fontWeight: 500,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </MenuItem>
                  ))
                : menuItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={handleCloseUserMenu}
                      component="a"
                      href={item.href}
                    >
                      <Typography
                        textAlign="center"
                        sx={{
                          fontWeight: 500,
                        }}
                      >
                        {item.text}
                      </Typography>
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
