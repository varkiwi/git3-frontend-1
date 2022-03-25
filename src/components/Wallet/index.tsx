import React, { useState, useEffect } from "react";
import { Button } from "components/Button";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { ethers } from "ethers";
import { WalletContainer } from "containers/WalletContainer";
import { Box, Modal, Typography } from "@mui/material";
import { CustomizedModalContent } from "components/Donate/styled";

export const Wallet: React.FC = () => {
  const {
    walletActive,
    setWalletActive,
    walletAddress,
    setWalletAddress,
    setWeb3Provider,
    gitRepository,
    setRepositoryDonations,
  } = WalletContainer.useContainer();

  const checkChainID = (chainId: string) => {
    return chainId === process.env.CHAINID;
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

  const showModal = async () => {
    let provider: any;
    try {
      provider = await web3Modal.connect();
      console.log(provider);
    } catch (e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    if (checkChainID(provider.networkVersion)) {
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const gitRepo = gitRepository;
      if (gitRepo !== null) {
        // we are providing the signer to the gitRepository object, since otherwise
        // we are not able to send state chaning tx
        gitRepo.web3Signer = web3Provider.getSigner();
      }
      setWalletActive(true);
      setWalletAddress(provider.selectedAddress);
      setWeb3Provider(web3Provider);
    } else {
      setOpenModal(true);
      console.log("error gosc");
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
        gitRepo.tips.then((tips: any) => {
          setRepositoryDonations(tips);
        });
      }
    });
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log("ChainID Changed", chainId);
      if (!checkChainID(chainId.toString())) {
        setWalletActive(false);
      }
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
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // useEffect(() => {
  //   showModal();
  // }, [showModal]);

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
            Please switch your network to Polygon Mumbai.
            <br /> We currently only support this network.
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
