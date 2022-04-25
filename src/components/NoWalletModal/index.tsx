import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { CustomizedModalContent } from "./styled";
import { Button } from "components/Button";

interface NoWalletModalProps {
  openModal: boolean;
  handleCloseModal: () => void;
}

export const NoWalletModal: React.FC<NoWalletModalProps> = (props) => {
  const { openModal, handleCloseModal } = props;

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <CustomizedModalContent>
        <Typography variant="h2">No wallet found</Typography>
        <Typography sx={{ mt: 2 }}>
          Connect a wallet in order to submit an issue.
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
  );
};
