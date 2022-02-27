import { TabContext } from "@mui/lab";
import { Box, Modal, Tab, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CustomizedModalContent,
  CustomizedTabList,
  RepoNavHeader,
} from "./styled";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button } from "components/Button";
import { TextField } from "components/TextField";

export const RepoNav: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const [tabValue, setTabValue] = React.useState("/repo");
  const handleTabClick = (value: string) => {
    setTabValue(value);
    history.push(value);
  };

  useEffect(() => {
    location.pathname.includes("repo")
      ? setTabValue("/repo")
      : setTabValue("/issues");
  }, [location.pathname]);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return location.pathname !== "/" ? (
    <>
      <RepoNavHeader>
        <Typography variant="h2" marginBottom={2}>
          frontend-repo
        </Typography>
        <Box display="flex" alignItems="center">
          <Button
            label="Donate"
            size="small"
            color="primary"
            variant="outlined"
            startIcon={<FavoriteBorderIcon />}
            onClick={handleOpenModal}
          />
        </Box>
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <CustomizedModalContent>
          <Typography variant="h2">Donate</Typography>
          <Typography sx={{ mt: 2 }}>
            How much would like to donate ?
          </Typography>
          <TextField
            label="Bounty"
            fullWidth
            sx={{ mt: 2 }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <Box
            marginTop={2}
            display="flex"
            justifyContent="flex-end"
            gap="16px"
          >
            <Button
              label="Close"
              size="small"
              color="primary"
              variant="contained"
            />
            <Button
              label="Ok"
              size="small"
              color="secondary"
              variant="contained"
            />
          </Box>
        </CustomizedModalContent>
      </Modal>
    </>
  ) : null;
};
