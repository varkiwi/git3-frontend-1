import { Container, Grid } from "@mui/material";
import { Button } from "components/Button";
import { Table } from "components/Table";
import { GitContainer } from "containers/GitContainer";
import { WalletContainer } from "containers/WalletContainer";
import { CodeTableRow } from "interfaces/RowData";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import loadSmartContract from "utils/utils";

export const Issue: React.FC = () => {
  const { repoUrl, gitRepository } = WalletContainer.useContainer();
  const { gitFactory, ipfsClient } = GitContainer.useContainer();

  const history = useHistory();
  const location = useLocation();

  const [issues, setIssues] = useState<Array<Object>>([]);
  const handleNewIssueClick = () => {
    history.push(`${repoUrl}/issues/new`);
  };
  const handleRowClick = (row: CodeTableRow) => {
    localStorage.setItem("issue", JSON.stringify(row));
    history.push(`${repoUrl}/issues/1`);
  };

  const fetchIssues = useCallback(async () => {
    const userAddress = location.pathname.slice(1).split("/")[0];
    const repoName = location.pathname.slice(1).split("/")[1];
    const gitRepo = await loadSmartContract(gitFactory, userAddress, repoName);
    const issueHashes = await gitRepo.allIssues;
    const issues = issueHashes[0].map((userCidHash: any) =>
      gitRepo.issue(userCidHash),
    );
    Promise.all(issues)
      .then((allIssues) =>
        allIssues.map(async (issue, index) => {
          // resolve the cid to get the issues data
          const issueDataRaw = await ipfsClient.cat(issue[0][2]);
          const issueData = JSON.parse(issueDataRaw.toString());
          let state;
          if (issue[0].state === 0) {
            state = "Open";
          } else if (issue[0].state === 1) {
            state = "Closed";
          } else if (issue[0].state === 2) {
            const currentBlockNumber =
              await gitRepository.web3Provider.getBlockNumber();
            const remainingBlocks =
              604800 - (currentBlockNumber - issue[0].resolvedBlockNumber);
            state = `Resolved ( ${remainingBlocks} till closing )`;
          } else {
            state = "Unknown";
          }
          return {
            state,
            bounty: ethers.utils.formatEther(issue[0].bounty),
            opener: issue[0].opener,
            title: `#${issue[0].issueNumber} ${issueData.issueTitle}`,
            text: issueData.issueText,
            answers: issue[0].issueAnswers,
            issueNumber: issue[0].issueNumber.toString(),
            issueHash: issueHashes[0][index],
          };
        }),
      )
      .then((allIssues) => Promise.all(allIssues))
      .then((data) => {
        setIssues(data.reverse());
      })
      .catch((error) => {
        console.error(error.message);
      });
    // resolve the hashes to the actual issues
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <Container>
      <Grid container justifyContent="flex-end" marginTop={4} marginBottom={2}>
        <Grid item>
          <Button
            label="New issue"
            size="small"
            color="secondary"
            variant="contained"
            sx={{ float: "right" }}
            onClick={handleNewIssueClick}
          />
        </Grid>
      </Grid>
      <Table handleRowClick={handleRowClick} />
    </Container>
  );
};
