import { ethers } from "ethers";
import { createContainer } from "unstated-next";
import gitFactoryJson from "../assets/contracts/GitFactory.sol/GitFactory.json";
import { create } from "ipfs-http-client";
import React, { useState } from "react";
import { EChainType } from "enums/ChainType";

interface GitState {
  gitFactory: any;
  ipfsClient: any;
  setChainType: (chainType: EChainType) => void;
}

export const GitContainer = createContainer<GitState>(() => {
  const [chainType, setChainType] = useState<EChainType>(
    localStorage.getItem("chainType") || EChainType.MUMBAI,
  );

  console.log('ChainType', chainType);
  console.log('setChainType', setChainType);

  let gitFactoryAddress;
  let rpcEndpoint;
  switch (chainType) {
    case EChainType.GODWOKEN:
      gitFactoryAddress = process.env.GITFACTORY_ADDRESS_GODWOKEN ?? "";
      rpcEndpoint = process.env.RPC_ENDPOINT_GODWOKEN;
      break;
    default:
      gitFactoryAddress = process.env.GITFACTORY_ADDRESS_MUMBAI ?? "";
      rpcEndpoint = process.env.RPC_ENDPOINT_MUMBAI;
  }
  console.log(gitFactoryAddress);
  console.log(rpcEndpoint);
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
  const gitFactoryAbi = gitFactoryJson.abi;
  const gitFactory = new ethers.Contract(
    gitFactoryAddress,
    gitFactoryAbi,
    provider,
  );

  const ipfsClient = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });

  return {
    gitFactory,
    ipfsClient,
    setChainType,
  };
});
