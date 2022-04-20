import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createContainer } from "unstated-next";
import loadSmartContract from "utils/utils";
import { GitContainer } from "./GitContainer";

interface WalletState {
  walletActive: boolean;
  setWalletActive: (walletActive: boolean) => void;
  walletAddress: string;
  setWalletAddress: (walletAddress: string) => void;
  web3Provider: any;
  setWeb3Provider: (web3Provider: any) => void;
  gitRepository: any;
  setGitRepository: (gitRepository: any) => void;
  repoUrl: string;
  setRepoUrl: (repoUrl: string) => void;
}

export const WalletContainer = createContainer<WalletState>(() => {
  const [walletActive, setWalletActive] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [web3Provider, setWeb3Provider] = useState<any>("");
  const [gitRepository, setGitRepository] = useState<any>(null);
  const [repoUrl, setRepoUrl] = useState<string>("");

  const location = useLocation();
  const { gitFactory } = GitContainer.useContainer();

  const loadContract = useCallback(async () => {
    const userAddress = location.pathname.slice(1).split("/")[0];
    const repoName = location.pathname.slice(1).split("/")[1];
    if (!repoName || !userAddress) return;
    const gitRepo = await loadSmartContract(gitFactory, userAddress, repoName);
    setGitRepository(gitRepo);
  }, []);

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  return {
    walletActive,
    setWalletActive,
    walletAddress,
    setWalletAddress,
    web3Provider,
    setWeb3Provider,
    gitRepository,
    setGitRepository,
    repoUrl,
    setRepoUrl,
  };
});
