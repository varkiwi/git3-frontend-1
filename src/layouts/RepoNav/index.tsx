import { TabContext } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CustomizedTabList, RepoNavHeader } from "./styled";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import { Donate } from "components/Donate";
import { WalletContainer } from "containers/WalletContainer";

export const RepoNav: React.FC = () => {
  const { walletActive, repoUrl, setRepoUrl } = WalletContainer.useContainer();

  const history = useHistory();
  const location = useLocation();
  const userAddress = location.pathname.slice(1).split("/")[0];
  const repoName = location.pathname.slice(1).split("/")[1];

  const [tabValue, setTabValue] = React.useState("/repo");
  const handleTabClick = (value: string) => {
    const params = new URLSearchParams(location.search);
    setTabValue(value);
    history.push({ pathname: `${repoUrl}${value}`, search: params.toString() });
  };

  useEffect(() => {
    location.pathname.includes("issues")
      ? setTabValue("/issues")
      : setTabValue(`/repo`);

    setRepoUrl(`/${userAddress}/${repoName}`);
  }, [location.pathname]);

  return location.pathname !== "/" ? (
    <>
      <RepoNavHeader>
        <Typography variant="h2" marginBottom={2}>
          {repoName}
        </Typography>
        {walletActive && <Donate />}
      </RepoNavHeader>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <CustomizedTabList textColor="inherit" indicatorColor="secondary">
            <Tab
              label="/Code"
              value="/repo"
              icon={<CodeOutlinedIcon />}
              iconPosition="start"
              onClick={() => handleTabClick("/repo")}
            />
            <Tab
              label="/Issues"
              value="/issues"
              icon={<BugReportOutlinedIcon />}
              iconPosition="start"
              onClick={() => handleTabClick("/issues")}
            />
          </CustomizedTabList>
        </Box>
      </TabContext>
    </>
  ) : null;
};
