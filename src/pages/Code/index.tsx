import {
  Container,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Button } from "components/Button";
import { File } from "components/File";
import React, { useCallback, useEffect, useState } from "react";
import { Table } from "components/Table";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import { CustomizedPopover } from "./styled";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { CodeTableRow } from "interfaces/RowData";
import { useLocation, useHistory } from "react-router-dom";
import { WalletContainer } from "containers/WalletContainer";
import loadSmartContract from "utils/utils";
import { GitContainer } from "containers/GitContainer";
import { Branches } from "./subpages/Branches";
import { Download } from "./subpages/Download";

export const Code: React.FC = () => {
  const { setGitRepository, setRepositoryDonations, repoUrl } =
    WalletContainer.useContainer();
  const { gitFactory, ipfsClient } = GitContainer.useContainer();

  const location = useLocation();
  const history = useHistory();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const pathParams = params?.get("path")?.split(",");

  const [branchesNames, setBranchesNames] = useState([]);
  const [files, setFiles] = useState<Array<Object>>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [repoName, setRepoName] = useState<string>("");
  const [fileContent, setFileContent] = useState<Array<Object>>([]);
  const [readFileMode, setReadFileMode] = useState<boolean>(false);
  const [showFileContent, setShowFileContent] = useState<boolean>(false);
  const [remoteDatabase, setRemoteDatabase] = useState<any>(null);
  const [directoryPath, setDirectoryPath] = useState<any>([]);
  const [currentBranchName, setCurrentBranchName] = useState<string>("main");

  const updatedBranchNames = async (gitRepo: any) => {
    const branchNames = await gitRepo.getBranchNames();
    setBranchesNames(branchNames[0]);
  };

  const resolveCID = async (cid: string, pathParams: any) => {
    const data = await ipfsClient.cat(cid);
    data
      .next()
      .then((obj: any) => {
        return JSON.parse(new TextDecoder("utf-8").decode(obj.value));
      })
      .then((remoteDatabase: any) => {
        const directoryPath = pathParams ? pathParams : ["files"];
        const lastElem = directoryPath[directoryPath.length - 1];
        setDirectoryPath(directoryPath);
        setRemoteDatabase(remoteDatabase);
        if (lastElem?.includes(".")) {
          setFileContent(JSON.parse(localStorage.getItem("fileContent")));
          setReadFileMode(true);
        } else {
          displayFiles(remoteDatabase, directoryPath);
        }
      });
  };

  function calculateCommitTime(commitTimestamp: number) {
    const currentTimestamp = Math.round(new Date().getTime() / 1000);
    const diffSec = Math.round(currentTimestamp - commitTimestamp);
    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    }
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    }
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 365) {
      return `${diffDays} days ago`;
    }
    return `${Math.round(diffDays / 365)} yeats ago`;
  }

  const displayFiles = (remoteDatabase: any, directoryPath?: string[]) => {
    /**
     * Function goes through the remote updatedBranchNames and displays the files
     * from the selected directory.
     */
    let folder = remoteDatabase;
    // check where the user currently is
    for (const path of directoryPath) {
      folder = folder[path];
    }
    // update the entries with some additional data
    const files = Object.keys(folder).map((key) => {
      const entry = folder[key];
      entry.type = entry.mode === 33188 ? "file" : "dir";
      entry.commit_time = calculateCommitTime(entry.commit_time);
      return entry;
    });
    // if we are in a subdirectory, we need the user to give the possibility to go back
    if (directoryPath.length > 1) {
      files.unshift({ name: ". .", type: "dotdot" });
    }
    setFiles(files);
  };

  const loadRemoteFiles = async (
    branchName: string,
    gitRepo: any,
    pathParams: any,
  ) => {
    gitRepo
      .getBranch(branchName)
      .then((branch: any) => {
        if (branch[0][0] === false) {
          throw new Error("Branch is not active");
        }
        const cid = branch[0][1];
        return resolveCID(cid, pathParams);
      })
      .catch((err: Error) => {
        console.log("Err", err);
      });
  };

  const loadGitRepository = useCallback(
    async (repoName: string, userAddress: string, pathParams: any) => {
      const gitRepo = await loadSmartContract(
        gitFactory,
        userAddress,
        repoName,
      );
      setGitRepository(gitRepo);
      // if (web3Provider !== null) {
      //   gitRepo.web3Signer = web3Provider.getSigner();
      // }
      gitRepo.tips.then((tips: any) => {
        setRepositoryDonations(tips);
      });
      updatedBranchNames(gitRepo).then(() => {
        const currentBranchName =
          localStorage.getItem("currentBranchName") || "main";
        setCurrentBranchName(currentBranchName);
        loadRemoteFiles(currentBranchName, gitRepo, pathParams);
      });
    },
    [],
  );

  useEffect(() => {
    if (!params?.get("path")) {
      setReadFileMode(false);
      initRepositoryActions();
    }
  }, [location]);

  useEffect(() => {
    initRepositoryActions();
  }, [loadGitRepository]);

  useEffect(() => () => localStorage.clear(), []);

  const initRepositoryActions = (path?: string[]) => {
    const repoName = location.pathname.slice(1).split("/")[1];
    const userAddress = location.pathname.slice(1).split("/")[0];
    setUserAddress(userAddress);
    setRepoName(repoName);
    loadGitRepository(repoName, userAddress, path || pathParams);
  };

  const handleRowClick = (row: CodeTableRow) => {
    changeDirectory(row);
  };

  const changeDirectory = async (value: any) => {
    /**
     * Function triggered whenever a user clicks on of the rows in order to load a file or
     * change directory.
     */
    if (value.type === "file") {
      const data = await ipfsClient.cat(value.cid);
      await data.next().then((obj: any) => {
        let fileContent = JSON.parse(
          new TextDecoder("utf-8").decode(obj.value),
        );
        setShowFileContent(true);
        let lineNumber = 0;
        // replaces the last newline with a whitespace, in case there is one
        if (fileContent.content.endsWith("\n")) {
          fileContent.content = fileContent.content.replace(/\n$/, "");
        }
        fileContent = fileContent.content.split("\n").map((text: string) => {
          lineNumber += 1;
          return { line: lineNumber, text };
        });
        setFileContent(fileContent);
        directoryPath.push(value.name);
        const path = directoryPath.join(",");
        setReadFileMode(true);
        history.push(`${repoUrl}/repo?path=${path}`);
        localStorage.setItem("fileContent", JSON.stringify(fileContent));
      });
    } else {
      let directoryPathArr = directoryPath;
      if (value.name === ". ." && value.type === "dotdot") {
        directoryPathArr = directoryPathArr.slice(
          0,
          directoryPathArr.length - 2,
        );
      } else {
        directoryPathArr.push(value.name);
        directoryPathArr.push("files");
      }
      setDirectoryPath(directoryPathArr);
      const path = directoryPathArr.join(",");
      displayFiles(remoteDatabase, directoryPathArr);
      history.push(`${repoUrl}/repo?path=${path}`);
    }
  };

  return (
    <Container>
      <Grid
        container
        justifyContent="space-between"
        marginTop={4}
        marginBottom={2}
      >
        <Branches
          branchesNames={branchesNames}
          initRepositoryActions={initRepositoryActions}
          currentBranchName={currentBranchName}
          setReadFileMode={setReadFileMode}
        />
        <Download userAddress={userAddress} repoName={repoName} />
      </Grid>

      {readFileMode ? (
        <File fileContent={fileContent} />
      ) : (
        <Table
          handleRowClick={handleRowClick}
          data={files}
          showFileContent={showFileContent}
        />
      )}
    </Container>
  );
};
