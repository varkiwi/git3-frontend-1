import { ButtonProps } from "@mui/material";
import { Box, Modal, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { CustomizedModalContent } from "./styled";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import { WalletContainer } from "containers/WalletContainer";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

interface ExtendedButtonProps extends ButtonProps {
  label: string;
}

export const Donate: React.FC = () => {
  //   const { label, ...btnProps } = props;
  const {
    gitRepository,
    repositoryDonations,
    setRepositoryDonations,
    walletAddress,
    web3Provider,
  } = WalletContainer.useContainer();

  const location = useLocation();
  const userAddress = location.pathname.slice(1).split("/")[0];
  const repoAddress = location.pathname.slice(1).split("/")[1];
  const amount = 0.01;

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const collectTips = useCallback(async () => {
    const gitRepo = gitRepository;
    gitRepo
      .collectTips()
      .then((transaction: any) => {
        return transaction.wait();
      })
      .then(() => {
        return gitRepository.tips;
      })
      .then((tips: any) => {
        setRepositoryDonations(tips);
      });
  }, []);

  const sendDonation = async () => {
    // const currency = switch1 ? 'USD' : 'Matic';
    const tx = {
      from: walletAddress,
      to: repoAddress, // repo address
      value: ethers.utils.parseEther(amount.toString()),
    };
    const signer = web3Provider.getSigner();
    signer
      .sendTransaction(tx)
      .then((transaction: any) => {
        handleCloseModal();
        // waitingForTx = true;
        return transaction.wait();
      })
      .then(() => {
        // waitingForTx = false;
      });
  };

  return (
    <>
      {walletAddress.toLowerCase() === userAddress.toLowerCase() ? (
        <Button
          label="Collect tips"
          size="small"
          color="primary"
          variant="outlined"
          startIcon={<ThumbUpOffAltIcon />}
          onClick={collectTips}
        />
      ) : (
        <>
          <Box display="flex" alignItems="center">
            <Button
              label="Donate"
              size="small"
              color="primary"
              variant="outlined"
              startIcon={<FavoriteBorderIcon />}
              onClick={handleOpenModal}
            />
          </Box>
        </>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <CustomizedModalContent>
          <Typography variant="h2">Donate</Typography>
          <Typography sx={{ mt: 2 }}>
            How much would like to donate ?
          </Typography>
          <TextField
            label="Bounty"
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <Box
            marginTop={2}
            display="flex"
            justifyContent="flex-end"
            gap="16px"
          >
            <Button
              label="Close"
              size="small"
              color="primary"
              variant="contained"
              onClick={handleCloseModal}
            />
            <Button
              label="Ok"
              size="small"
              color="secondary"
              variant="contained"
              onClick={sendDonation}
            />
          </Box>
        </CustomizedModalContent>
      </Modal>
    </>
  );
};
