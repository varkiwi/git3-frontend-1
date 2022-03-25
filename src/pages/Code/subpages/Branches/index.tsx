import { ButtonProps, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { Button } from "components/Button";
import * as React from "react";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import { useHistory, useLocation } from "react-router-dom";
import { WalletContainer } from "containers/WalletContainer";

interface BranchesProps {
  branchesNames: Array<string>;
  initRepositoryActions: (path: string[]) => void;
  currentBranchName: string;
  setReadFileMode: (readFileMode: boolean) => void;
}

export const Branches: React.FC<BranchesProps> = (props) => {
  const {
    branchesNames,
    initRepositoryActions,
    currentBranchName,
    setReadFileMode,
  } = props;
  const { repoUrl } = WalletContainer.useContainer();

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const history = useHistory();

  const [anchorMenuEl, setAnchorMenuEl] = React.useState<null | HTMLElement>(
    null,
  );
  const openMenu = Boolean(anchorMenuEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorMenuEl(null);
  };

  const handleMenuItemClick = (branch: string) => {
    localStorage.setItem("currentBranchName", branch);
    history.push(`${repoUrl}/repo`);
    setReadFileMode(false);
    params?.set("path", "");
    initRepositoryActions(["files"]);
  };

  return (
    <>
      <Grid item display="flex" alignItems="center">
        <Button
          label={currentBranchName}
          size="small"
          color="primary"
          variant="contained"
          onClick={handleMenuClick}
          sx={{ marginRight: 2 }}
          startIcon={<AltRouteIcon />}
        />
        <Typography variant="body2" fontWeight={500}>
          {branchesNames.length} branches
        </Typography>
      </Grid>
      <Menu anchorEl={anchorMenuEl} open={openMenu} onClose={handleClose}>
        {branchesNames.map((branch) => (
          <MenuItem onClick={() => handleMenuItemClick(branch)} key={branch}>
            {branch}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
