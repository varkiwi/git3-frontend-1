import { Box, Container, Typography } from "@mui/material";
import { Link } from "components/Link";
import { GitContainer } from "containers/GitContainer";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const git3Logo = require("../../assets/img/git3Logo.png");

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

interface RepoLinks {
  name: string;
  href: string;
}

export const Dashboard: React.FC = () => {
  const { gitFactory } = GitContainer.useContainer();

  const history = useHistory();
  const [randomRepositories, setRandomRepositories] = useState<any[]>([]);

  const loadGitRepository = () => {
    let displayRepos: Array<string> = [];
    gitFactory
      .getRepositoryNames()
      .then((repoNames: Array<string>) => {
        // if there are already more than 3 repos available, pick 3 random
        // it is not really random, since it could repeat itself, but it is currently not
        // super important :)
        if (repoNames.length > 3) {
          displayRepos[0] = repoNames[getRandomArbitrary(0, repoNames.length)];
          displayRepos[1] = repoNames[getRandomArbitrary(0, repoNames.length)];
          displayRepos[2] = repoNames[getRandomArbitrary(0, repoNames.length)];
        } else {
          displayRepos = repoNames;
        }
        const resolve: Promise<Array<string>>[] = [];
        displayRepos.forEach((repo) =>
          resolve.push(gitFactory.getRepositoriesUserList(repo)),
        );
        return Promise.all(resolve);
      })
      .then((data: any) => {
        const whatsNext: Array<RepoLinks> = [];
        data.map((item: Array<string>, index: number) => {
          whatsNext.push({
            name: displayRepos[index],
            href: `${item[0]}/${displayRepos[index]}`,
          });
        });
        setRandomRepositories(whatsNext);
      });
  };

  const handleReponameClick = (repo: RepoLinks) => {
    history.push(`/${repo.href}/repo`);
  };

  useEffect(() => {
    loadGitRepository();
  }, [gitFactory]);

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="32px"
        marginTop={2}
      >
        <img src={git3Logo.default} alt={git3Logo} />
        <Typography variant="h1" marginTop={4}>
          Welcome to Git3
        </Typography>
        <Typography variant="h2">
          Start by searching for some repositories, like:
        </Typography>
        <Box display="flex" gap="10px">
          {randomRepositories.map((repo, index) => (
            <Link
              key={`${repo.name} ${index}`}
              label={repo.name}
              onClick={() => handleReponameClick(repo)}
            />
          ))}
        </Box>
        <Typography variant="h2">
          You want to learn more about the project:
        </Typography>
        <Box display="flex" gap="10px">
          <Link label="Github" href="https://github.com/varkiwi/" />
          <Link
            label="Gitcoin Grant"
            href="https://gitcoin.co/grants/1490/git3"
          />
          <Link
            label="Hackernoon: Git3 - First Alpha Release"
            href="https://hackernoon.com/git3-first-alpha-release-co1n32ix"
          />
        </Box>
      </Box>
    </Container>
  );
};
