import * as React from "react";
import { CustomizedAppBar } from "./styled";
import { Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import { Search } from "components/Search";
import { useHistory } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Wallet } from "components/Wallet";

const git3Logo = require("../../assets/img/git3Logo.png");

export const Header: React.FC = () => {
  const history = useHistory();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleLogoClick = () => {
    history.push("/");
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <CustomizedAppBar position="static">
      <Toolbar>
        <img src={git3Logo.default} alt={git3Logo} onClick={handleLogoClick} />
        <Box marginLeft={3}>
          <Search />
        </Box>
        <Box flexGrow={1} />
        <Box>
          <Wallet />
        </Box>
        <IconButton size="large" onClick={handleOpenNavMenu}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Menu
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
        <MenuItem>
          <Search />
        </MenuItem>
      </Menu>
    </CustomizedAppBar>
  );
};
