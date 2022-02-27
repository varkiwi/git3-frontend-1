import { Box, Container, Typography } from "@mui/material";
import { Link } from "components/Link";
import * as React from "react";

const git3Logo = require("../../assets/img/git3Logo.png");

export const Dashboard: React.FC = () => {
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
