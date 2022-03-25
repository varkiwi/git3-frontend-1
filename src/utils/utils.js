import GitRepository from "./GitRepository";

async function loadSmartContract(gitFactory, userAddress, repositoryName) {
  return gitFactory.functions
    .getUserRepoNameHash(userAddress, repositoryName)
    .then((userRepoNameHash) =>
      gitFactory.functions.getRepository(userRepoNameHash[0]),
    )
    .then((repoInfo) => {
      if (repoInfo[0][0] === true) {
        return new GitRepository(repoInfo[0][2], gitFactory.provider);
      }
      console.log("Inactive");
      return false;
    });
}

export default loadSmartContract;
