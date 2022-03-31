import { Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import { Timeline } from "components/Timeline";
import { GitContainer } from "containers/GitContainer";
import { WalletContainer } from "containers/WalletContainer";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
import { NoWalletModal } from "components/NoWalletModal";

export const PreviewIssue: React.FC = () => {
  const { gitRepository, web3Provider, repoUrl, walletAddress } =
    WalletContainer.useContainer();
  const { ipfsClient } = GitContainer.useContainer();

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const [answers, setAnswers] = useState<any>([]);
  const [action, setAction] = useState<string>("");

  const location = useLocation();
  const userAddress = location.pathname.slice(1).split("/")[0];
  const issueStorage = JSON.parse(localStorage.getItem("issue"));
  const isCloseIssue =
    issueStorage.opener &&
    walletAddress &&
    walletAddress.toLowerCase() === issueStorage.opener.toLowerCase();

  useEffect(() => {
    const answers = issueStorage.answers.map((answer) =>
      ipfsClient
        .cat(answer[0])
        .next()
        .then((rawData) =>
          JSON.parse(new TextDecoder("utf-8").decode(rawData.value)),
        ),
    );
    Promise.all(answers).then((data) => {
      setAnswers(data);
    });

    if (+issueStorage.bounty > 0 && issueStorage.state === "Open") {
      setAction("resolve");
    } else {
      setAction("close");
    }
  }, []);

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
        author: userAddress,
      };
      let cid;
      ipfsClient
        .add(Buffer.from(JSON.stringify(issue)))
        .then((answer) => {
          cid = answer.path;
          const overrides = {
            value: ethers.utils.parseEther(form.bounty.toString()),
          };
          return gitRepo.appendAnswerToIssue(
            issueStorage.issueHash,
            cid,
            overrides,
          );
        })
        .then((tx) => {
          loading = true;
          return tx.wait();
        })
        .then((result) => {
          loading = false;
          setAnswers([...answers, issue]);
          issueStorage.answers.push([cid, result.from]);
          localStorage.setItem("issue", JSON.stringify(issueStorage));
        });
    }
  };

  const postAndCloseComment = async (form: Object) => {
    await postComment(form);
    loading = true;
    const gitRepo = gitRepository;
    if (+issueStorage.bounty > 0) {
      // when there is a bounty, we have to resolve it first,
      // before we can close it! This might change in the future or maybe should :D
      gitRepo
        .updateIssueState(issueStorage.issueHash, 2)
        .then((tx) => tx.wait())
        .then(() => {
          issueStorage.state = "Resolved";
          localStorage.setItem("issue", JSON.stringify(issueStorage));
          loading = false;
        });
    } else {
      // there is no bounty, so we can close the issue :)
      gitRepo
        .updateIssueState(issueStorage.issueHash, 1)
        .then((tx) => tx.wait())
        .then(() => {
          issueStorage.state = "Closed";
          localStorage.setItem("issue", JSON.stringify(issueStorage));
          loading = false;
        });
    }
  };

  const { control, handleSubmit, watch } = useForm();
  const disableSubmitBtn = watch("comment") === "" || watch("bounty") === "";

  return (
    <Container>
      <Box marginTop={5} marginBottom={2} display="flex">
        <Typography variant="h2">{issueStorage.title}</Typography>
        <Typography variant="h2" color="text.secondary" marginLeft={1}>
          #{issueStorage.issueNumber}
        </Typography>
      </Box>
      <Timeline issueStorage={issueStorage} answers={answers} />
      <form
        onSubmit={handleSubmit(
          isCloseIssue ? postAndCloseComment : postComment,
        )}
      >
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
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Leave a comment"
                  multiline
                  rows={4}
                  value={value}
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
                  value={value}
                  sx={{ display: "block", float: "right" }}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
        </Grid>
        {isCloseIssue && (
          <Button
            label={`Comment and ${action}`}
            size="small"
            color="secondary"
            variant="contained"
            type="submit"
            disabled={disableSubmitBtn}
            sx={{ float: "right" }}
          />
        )}
        <Button
          label="Comment"
          size="small"
          color="secondary"
          variant="contained"
          type="submit"
          disabled={disableSubmitBtn}
          sx={{ float: "right", marginRight: 4 }}
        />
      </form>
      <NoWalletModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
      />
    </Container>
  );
};
