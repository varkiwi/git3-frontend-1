import * as React from "react";
import { CustomizedAppBar } from "./styled";
import { Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import { Search } from "components/Search";
import { Button } from "components/Button";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useHistory } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const git3Logo = require("../../assets/img/git3Logo.png");

export const Header: React.FC = () => {
  const history = useHistory();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.VUE_APP_INFURA_ID,
      },
    },
  };

  let provider;

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    theme: "dark",
  });

  const [connected, setConnected] = useState(false);
  const buttonLabel = connected ? "0xb83...49a8" : "Connect Wallet";

  const showModal = () => {
    console.log("asdfas");
    setConnected(true);
    // try {
    //   provider = web3Modal.connect();
    // } catch (e) {
    //   console.log("Could not get a wallet connection", e);
    //   return;
    // }
  };

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
          <Button
            label={buttonLabel}
            size="large"
            color="secondary"
            variant={connected ? "outlined" : "contained"}
            startIcon={connected && <AccountBalanceWalletOutlinedIcon />}
            onClick={showModal}
          />
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
