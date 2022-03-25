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
    "https://matic-mumbai.chainstacklabs.com",
  );

  const gitFactoryAbi = gitFactoryJson.abi;
  const gitFactoryAddress = "0x38FF86F13806F4Fb5A15Ba3558Ff257875D2acd8";
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
