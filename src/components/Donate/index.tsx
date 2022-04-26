import { Box, Modal, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { CustomizedModalContent } from "../NoWalletModal/styled";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import { WalletContainer } from "containers/WalletContainer";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Controller, useForm } from "react-hook-form";
import { Transaction } from "interfaces/Transaction";

interface SendDonateForm {
  bounty: number;
}

export const Donate: React.FC = () => {
  const { gitRepository, walletAddress, web3Provider } =
    WalletContainer.useContainer();

  const location = useLocation();
  const userAddress = location.pathname.slice(1).split("/")[0];

  const { control, handleSubmit } = useForm<SendDonateForm>();
  const [waitingForTx, setWaitingForTx] = useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const collectTips = async () => {
    gitRepository.web3Signer = web3Provider.getSigner();
    gitRepository
      .collectTips()
      .then((transaction: Transaction) => {
        setWaitingForTx(true);
        return transaction.wait();
      })
      .then(() => {
        setWaitingForTx(false);
        return gitRepository.tips;
      });
  };

  const sendDonation = async (form: SendDonateForm) => {
    // const currency = switch1 ? 'USD' : 'Matic';
    const tx = {
      from: walletAddress,
      to: gitRepository.repositoryAddress,
      value: ethers.utils.parseEther(form.bounty.toString()),
    };
    const signer = web3Provider.getSigner();
    signer
      .sendTransaction(tx)
      .then((transaction: Transaction) => {
        handleCloseModal();
        setWaitingForTx(true);
        return transaction.wait();
      })
      .then(() => {
        setWaitingForTx(false);
      })
      .catch((err: Error) => {
        console.log("Err", err);
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
          loading={waitingForTx}
          startIcon={waitingForTx ? null : <ThumbUpOffAltIcon />}
          onClick={collectTips}
        />
      ) : (
        <Button
          label="Donate"
          size="small"
          color="primary"
          variant="outlined"
          loading={waitingForTx}
          startIcon={waitingForTx ? null : <FavoriteBorderIcon />}
          onClick={handleOpenModal}
        />
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <CustomizedModalContent>
          <Typography variant="h2">Donate</Typography>
          <Typography sx={{ mt: 2 }}>
            How much would like to donate ?
          </Typography>
          <form onSubmit={handleSubmit(sendDonation)}>
            <Controller
              name="bounty"
              control={control}
              defaultValue={0}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Bounty"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={value}
                  onChange={onChange}
                />
              )}
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
                type="submit"
                loading={waitingForTx}
              />
            </Box>
          </form>
        </CustomizedModalContent>
      </Modal>
    </>
  );
};
