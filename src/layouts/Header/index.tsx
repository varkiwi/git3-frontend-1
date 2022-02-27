import * as React from "react";
import { CustomizedAppBar } from "./styled";
import { Box, Toolbar } from "@mui/material";
import { Search } from "components/Search";
import { Button } from "components/Button";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useHistory } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useState } from "react";

const git3Logo = require("../../assets/img/git3Logo.png");

export const Header: React.FC = () => {
  const history = useHistory();
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
      </Toolbar>
    </CustomizedAppBar>
  );
};
