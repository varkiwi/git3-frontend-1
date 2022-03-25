import { Box, Container, Grid, Modal, Paper, Typography } from "@mui/material";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import { WalletContainer } from "containers/WalletContainer";
import React, { useState } from "react";
import { ethers } from "ethers";
import { GitContainer } from "containers/GitContainer";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { CustomizedModalContent } from "components/Donate/styled";

interface IssueForm {
  title: string;
  comment: string;
  bounty: string;
}

export const NewIssue: React.FC = () => {
  const { gitRepository, web3Provider, repoUrl } =
    WalletContainer.useContainer();
  const { ipfsClient } = GitContainer.useContainer();

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const history = useHistory();

  let dialog = false;
  let loading = false;

  const submitIssue = (form: IssueForm) => {
    const issue = {
      issueText: form.comment,
      issueTitle: form.title,
      timestamp: Date.now(),
    };
    if (web3Provider === "") {
      setOpenModal(true);
      return;
    }
    let cid;
    const gitRepo = gitRepository;
    gitRepo.web3Signer = web3Provider.getSigner();
    ipfsClient
      .add(Buffer.from(JSON.stringify(issue)))
      .then((answer) => {
        cid = answer[0].hash;
        const overrides = {
          value: ethers.utils.parseEther(form.bounty.toString()),
        };
        return gitRepository.openIssue(cid, overrides);
      })
      .then((tx) => {
        loading = true;
        return tx.wait();
      })
      .then(() => {
        loading = false;
        return gitRepository.web3Signer.getAddress();
      })
      .then((address) => gitRepository.getUserCidHash(address, cid))
      .then((result) => gitRepository.issue(result[0]))
      .then((newIssue) => {
        let state;
        if (newIssue[0].state === 0) {
          state = "Open";
        } else if (newIssue[0].state === 1) {
          state = "Closed";
        } else if (newIssue[0].state === 2) {
          state = "Resolved";
        } else {
          state = "Unknown";
        }
        const issueData = {
          state,
          bounty: ethers.utils.formatEther(newIssue[0].bounty),
          opener: newIssue[0].opener,
          // number: newIssue[0].issueNumber,
          title: issue.issueTitle,
          text: issue.issueText,
          answers: [],
          issueNumber: newIssue[0].issueNumber.toString(),
        };
        localStorage.setItem("issue", JSON.stringify(issueData));
        history.push(`${repoUrl}/issues/${newIssue[0].issueNumber}`);
      });
  };

  const { control, handleSubmit, watch } = useForm();

  const disableSubmitBtn = watch("title") === "" || watch("comment") === "";

  return (
    <Container>
      <form onSubmit={handleSubmit(submitIssue)}>
        <Grid
          container
          flexDirection="column"
          justifyContent="space-between"
          gap={2}
          marginTop={4}
          marginBottom={2}
          padding={3}
          component={Paper}
        >
          <Grid item>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Title"
                  maxRows={4}
                  value={value}
                  onChange={onChange}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              name="comment"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Leave a comment"
                  multiline
                  rows={4}
                  fullWidth
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item>
            <Controller
              name="bounty"
              control={control}
              defaultValue={0}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Bounty"
                  sx={{ float: "right" }}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button
          label="Submit issue"
          size="small"
          color="secondary"
          variant="contained"
          sx={{ float: "right" }}
          type="submit"
          disabled={disableSubmitBtn}
        />
      </form>
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
    </Container>
  );
};
