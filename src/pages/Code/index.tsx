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
import React from "react";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import { Table } from "components/Table";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import { CustomizedPopover } from "./styled";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { CodeTableRow } from "interfaces/RowData";
import { useLocation, useHistory } from "react-router-dom";

interface Test {
  tab: string;
}

export const Code: React.FC<Test> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [anchorMenuEl, setAnchorMenuEl] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorPopoverEl, setAnchorPopoverEl] =
    React.useState<null | HTMLElement>(null);

  const openMenu = Boolean(anchorMenuEl);
  const openPopover = Boolean(anchorPopoverEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMenuEl(event.currentTarget);
  };
  const handlePopupClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorPopoverEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorMenuEl(null);
    setAnchorPopoverEl(null);
  };

  const git3Clone =
    "git3 clone 0xb8366796959023F0545532f9c60cd819962049A8/frontend-repo";
  const copyInputText = () => {
    navigator.clipboard.writeText(git3Clone);
  };

  const handleRowClick = (row: CodeTableRow) => {
    history.push("/repo/file.txt");
  };

  const readFileMode = location.pathname.includes(".");

  return (
    <Container>
      <Grid
        container
        justifyContent="space-between"
        marginTop={4}
        marginBottom={2}
      >
        <Grid item display="flex" alignItems="center">
          <Button
            label="main"
            size="small"
            color="primary"
            variant="contained"
            onClick={handleMenuClick}
            sx={{ marginRight: 2 }}
            startIcon={<AltRouteIcon />}
          />
          <Typography variant="body2" fontWeight={500}>
            1 branches
          </Typography>
        </Grid>
        <Grid item>
          <Button
            label="Download"
            size="small"
            color="secondary"
            variant="contained"
            sx={{ float: "right" }}
            onClick={handlePopupClick}
          />
        </Grid>
      </Grid>
      {readFileMode ? <File /> : <Table handleRowClick={handleRowClick} />}
      <Menu anchorEl={anchorMenuEl} open={openMenu} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
      <CustomizedPopover
        open={openPopover}
        anchorEl={anchorPopoverEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Grid container flexDirection="column">
          <Grid item>
            <TerminalOutlinedIcon sx={{ marginRight: 1.5 }} />
            <Typography>Clone</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Git3 CLI</Typography>
          </Grid>
          <Grid item>
            <OutlinedInput
              size="small"
              value={git3Clone}
              endAdornment={
                <InputAdornment position="end" onClick={copyInputText}>
                  <ContentCopyOutlinedIcon />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>
      </CustomizedPopover>
    </Container>
  );
};
