import { Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import { Timeline } from "components/Timeline";
import { GitContainer } from "containers/GitContainer";
import { WalletContainer } from "containers/WalletContainer";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ethers } from "ethers";

export const PreviewIssue: React.FC = () => {
  const { gitRepository, web3Provider, repoUrl } =
    WalletContainer.useContainer();
  const { ipfsClient } = GitContainer.useContainer();

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const issue = JSON.parse(localStorage.getItem("issue"));
  const { title, issueNumber, state, text, bounty } = issue;

  let action = "";
  if (issue.bounty > 0 && issue.state === "Open") {
    action = "resolve";
  } else {
    action = "close";
  }

  let answers = issue?.answers?.map((answer: string) =>
    ipfsClient
      .cat(answer[0])
      .then((rawData) => JSON.parse(new TextDecoder("utf-8").decode(rawData))),
  );
  if (answers?.length > 0) {
    Promise.all(answers).then((data) => {
      answers = data;
    });
  }

  let loading = false;

  const postComment = async (form: Object) => {
    if (form.comment.length > 0) {
      const gitRepo = gitRepository;
      if (web3Provider === "") {
        setOpenModal(true);
        return;
      }
      const issue = {
        issueText: form.comment,
        issueTitle: "",
        timestamp: Date.now(),
        author: await gitRepo.web3Signer.getAddress(),
      };
      let cid;
      ipfsClient
        .add(Buffer.from(JSON.stringify(issue)))
        .then((answer) => {
          cid = answer[0].hash;
          const overrides = {
            value: ethers.utils.parseEther(form.bounty.toString()),
          };
          return gitRepo.appendAnswerToIssue("", cid, overrides);
        })
        .then((tx) => {
          loading = true;
          return tx.wait();
        })
        .then(() => {
          loading = false;
          answers.push(issue);
          form.comment = "";
        });
    }
  };

  const { control, handleSubmit, watch } = useForm();

  return (
    <Container>
      <Box marginTop={5} marginBottom={2} display="flex">
        <Typography variant="h2">{issue.title}</Typography>
        <Typography variant="h2" color="text.secondary" marginLeft={1}>
          #{issue.issueNumber}
        </Typography>
      </Box>
      <Chip label="Open" color="secondary" />
      <Timeline text={issue.text} />
      <form onSubmit={handleSubmit(postComment)}>
        <Grid
          container
          flexDirection="column"
          gap={2}
          padding={3}
          marginBottom={2}
          component={Paper}
        >
          <Grid item>
            <Controller
              name="comment"
              control={control}
              defaultValue={0}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Leave a comment"
                  multiline
                  rows={4}
                  fullWidth
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
                  label="Add Bounty"
                  sx={{ display: "block", float: "right" }}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button
          label="Comment"
          size="small"
          color="secondary"
          variant="contained"
          type="submit"
          sx={{ float: "right" }}
        />
      </form>
    </Container>
  );
};
