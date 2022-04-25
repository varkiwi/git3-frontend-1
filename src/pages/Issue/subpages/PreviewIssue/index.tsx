import { Box, Container, Grid, Paper, Typography } from "@mui/material";
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
import { IpfsBufferResult, IpfsData } from "interfaces/Ipfs";
import { Transaction } from "interfaces/Transaction";
import { Answer } from "interfaces/Answer";

interface Issue {
  opener: string;
  answers: Array<Array<string>>;
  bounty: string;
  state: string;
  issueHash: string;
  issueNumber: number;
  title: string;
}
interface IssueForm {
  comment: string;
  bounty: number;
}

export const PreviewIssue: React.FC = () => {
  const { gitRepository, web3Provider, repoUrl, walletAddress } =
    WalletContainer.useContainer();
  const { ipfsClient } = GitContainer.useContainer();

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const location = useLocation();
  const userAddress = location.pathname.slice(1).split("/")[0];
//   const issueStorage: Issue = JSON.parse(localStorage.getItem("issue") || "{}");
  const [issueStorage, setIssueStorage] = useState<Issue>(JSON.parse(localStorage.getItem("issue") || "{}"));

  const isRepoOwner = walletAddress.toLowerCase() === userAddress.toLowerCase();
  const isIssueAuthor =
    walletAddress.toLowerCase() === issueStorage.opener.toLowerCase();
  const canResolveIssue =
    +issueStorage.bounty > 0 &&
    issueStorage.state !== "Resolved" &&
    isRepoOwner;

  const isCloseIssue =
    (issueStorage.bounty === "0.0" || issueStorage.state.includes("Resolved")) &&
    (isIssueAuthor || isRepoOwner) &&
    issueStorage.state !== "Closed";

  let action = "";
  if (+issueStorage.bounty > 0 && issueStorage.state === "Open") {
    action = "resolve";
  } else {
    action = "close";
  }

  useEffect(() => {
    const answers = issueStorage.answers.map((answer) =>
      ipfsClient
        .cat(answer[0])
        .next()
        .then((rawData: IpfsData) =>
          JSON.parse(new TextDecoder("utf-8").decode(rawData.value)),
        ),
    );
    Promise.all(answers).then((data) => {
      setAnswers(data);
    });
  }, []);

  const postComment = async (form: IssueForm) => {
      return new Promise((resolve) => {
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
            let cid: string;
            ipfsClient
              .add(Buffer.from(JSON.stringify(issue)))
              .then((answer: IpfsBufferResult) => {
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
              .then((tx: Transaction) => {
                setLoading(true);
                return tx.wait();
              })
              .then((result: any) => {
                setLoading(false);
                setAnswers([...answers, issue]);
                issueStorage.answers.push([cid, result.from]);
                localStorage.setItem("issue", JSON.stringify(issueStorage));
                resolve(true);
              });
          } else {
              resolve(true);
          }
    })
  };

  const postAndCloseComment = async (form: IssueForm) => {
    await postComment(form);
    const gitRepo = gitRepository;
    const isResolved = action === "resolve";
    // when there is a bounty, we have to resolve it first,
    // before we can close it! This might change in the future or maybe should :D
    gitRepo
      .updateIssueState(issueStorage.issueHash, isResolved ? 2 : 1)
      .then((tx: Transaction) => {
        setLoading(true);
        return tx.wait();
      })
      .then(() => {
        issueStorage.state = isResolved ? "Resolved" : "Closed";
        localStorage.setItem("issue", JSON.stringify(issueStorage));
        setLoading(false);
      });
  };

  const { control, handleSubmit, watch } = useForm<IssueForm>();
  const disableSubmitBtn = watch("comment") === "";
  const submitForm = (isCommit: boolean) => {
    isCommit
      ? handleSubmit(postComment)()
      : handleSubmit(postAndCloseComment)();
  };

  return (
    <Container>
      <Box marginTop={5} marginBottom={2} display="flex">
        <Typography variant="h2">{issueStorage.title}</Typography>
        <Typography variant="h2" color="text.secondary" marginLeft={1}>
          #{issueStorage.issueNumber}
        </Typography>
      </Box>
      <Timeline issueStorage={issueStorage} answers={answers} />
      <form>
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
        {(canResolveIssue || isCloseIssue) && (
          <Button
            label={`Comment and ${action}`}
            size="small"
            color="secondary"
            variant="contained"
            disabled={disableSubmitBtn}
            loading={loading}
            onClick={() => submitForm(false)}
            sx={{ float: "right" }}
          />
        )}
        <Button
          label="Comment"
          size="small"
          color="secondary"
          variant="contained"
          disabled={disableSubmitBtn}
          loading={loading}
          onClick={() => submitForm(true)}
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
