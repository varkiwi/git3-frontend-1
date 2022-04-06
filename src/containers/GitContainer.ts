import { ethers } from "ethers";
import { createContainer } from "unstated-next";
import gitFactoryJson from "../assets/contracts/GitFactory.sol/GitFactory.json";
import { create } from "ipfs-http-client";

interface GitState {
  gitFactory: any;
  ipfsClient: any;
}

export const GitContainer = createContainer<GitState>(() => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_ENDPOINT,
  );

  const gitFactoryAbi = gitFactoryJson.abi;
  const gitFactoryAddress = process.env.GITFACTORY_ADDRESS ?? "";
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
  };
});
