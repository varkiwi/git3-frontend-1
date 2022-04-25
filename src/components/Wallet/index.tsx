import React, { useState } from "react";
import { Button } from "components/Button";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { ethers } from "ethers";
import { WalletContainer } from "containers/WalletContainer";
import { Box, Modal, Typography } from "@mui/material";
import { CustomizedModalContent } from "components/NoWalletModal/styled";
import { GitContainer } from "containers/GitContainer";
import { EChainType } from "enums/ChainType";
import { useHistory } from "react-router-dom";

interface Provider {
  chainId: string;
}

export const Wallet: React.FC = () => {
  const {
    walletActive,
    setWalletActive,
    walletAddress,
    setWalletAddress,
    setWeb3Provider,
    gitRepository,
  } = WalletContainer.useContainer();
  const { chainType, setChainType } = GitContainer.useContainer();

  const history = useHistory();

  const checkChainID = (chainId: string) => {
    let supportedChains: Array<string>;
    if (process.env.SUPPORTED_CHAINIDS) {
      supportedChains = process.env.SUPPORTED_CHAINIDS.split(",");
      return supportedChains.includes(chainId);
    }
  };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
  };

  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    theme: "dark",
  });

  const changeChainType = (provider: Provider) => {
    if (provider.chainId === process.env.CHAINID_GODWOKEN) {
      localStorage.setItem("chainType", EChainType.GODWOKEN);
      setChainType(EChainType.GODWOKEN);
    } else {
      localStorage.setItem("chainType", EChainType.MUMBAI);
      setChainType(EChainType.MUMBAI);
    }
    if (localStorage.getItem("chainType") !== chainType) {
      history.push("/");
    }
  };

  const showModal = async () => {
    let provider: any;
    try {
      provider = await web3Modal.connect();
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    if (checkChainID(provider.chainId)) {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const gitRepo = gitRepository;
      if (gitRepo !== null) {
        // we are providing the signer to the gitRepository object, since otherwise
        // we are not able to send state chaning tx
        gitRepo.web3Signer = web3Provider.getSigner();
      }
      changeChainType(provider);
      setWalletActive(true);
      setWalletAddress(provider.selectedAddress);
      setWeb3Provider(web3Provider);
    } else {
      setOpenModal(true);
      return;
    }

    provider.on("accountsChanged", (accounts: string[]) => {
      typeof accounts;
      const gitRepo = gitRepository;
      if (accounts.length === 0) {
        setWalletActive(false);
        gitRepo.web3Signer = undefined;
      } else {
        console.log(`Accounts changed: ${accounts}`);
        setWalletAddress(provider.selectedAddress);
      }
    });
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log("ChainID Changed", chainId);
      if (!checkChainID(chainId.toString())) {
        setWalletActive(false);
      }
      changeChainType(provider);
      history.push("/");
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      console.log("Connect:", info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", () => {
      console.log("Provider disconnected:");
      setWalletActive(false);
    });
  };

  const formatAddress = (address: string): string => {
    return `${address.substring(0, 5)}...${address.substring(
      address.length - 5,
    )}`;
  };

  const buttonLabel = walletActive
    ? formatAddress(walletAddress)
    : "Connect Wallet";

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Button
        label={buttonLabel}
        size="large"
        color="secondary"
        variant={walletActive ? "outlined" : "contained"}
        startIcon={walletActive && <AccountBalanceWalletOutlinedIcon />}
        onClick={showModal}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <CustomizedModalContent>
          <Typography variant="h2">Switch network</Typography>
          <Typography sx={{ mt: 2 }}>
            Please switch your network to Polygon Mumbai and Nervos Godwoken
            Testnet.
            <br /> We currently only support this networks.
          </Typography>

          <Box marginTop={2} display="flex" justifyContent="flex-end">
            <Button
              label="Ok"
              size="small"
              color="secondary"
              variant="contained"
              onClick={handleCloseModal}
            />
          </Box>
        </CustomizedModalContent>
      </Modal>
    </>
  );
};
