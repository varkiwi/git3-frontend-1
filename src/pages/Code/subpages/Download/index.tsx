import {
  ButtonProps,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Button } from "components/Button";
import * as React from "react";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import { CustomizedPopover } from "./styled";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

interface DownloadProps {
  repoName: string;
  userAddress: string;
}

export const Download: React.FC<DownloadProps> = (props) => {
  const { repoName, userAddress } = props;

  const [anchorPopoverEl, setAnchorPopoverEl] =
    React.useState<null | HTMLElement>(null);
  const openPopover = Boolean(anchorPopoverEl);
  const handlePopupClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorPopoverEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorPopoverEl(null);
  };

  const git3Clone = `git3 clone ${userAddress}/${repoName}`;

  const copyInputText = () => {
    navigator.clipboard.writeText(git3Clone);
  };

  return (
    <>
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
    </>
  );
};
