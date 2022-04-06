import {
  Box,
  ButtonProps,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Button } from "components/Button";
import * as React from "react";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import { useHistory, useLocation } from "react-router-dom";
import { WalletContainer } from "containers/WalletContainer";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface BranchesProps {
  directoryPath: Array<string>;
  emitFolderNavClick: (path: string[]) => void;
}

export const FolderNav: React.FC<BranchesProps> = (props) => {
  const { directoryPath, emitFolderNavClick } = props;

  const handleFolderNavClick = (index: number) => {
    if (index + 1 !== directoryPath.length) {
      directoryPath.splice(index + 2);
      emitFolderNavClick(directoryPath);
    }
  };

  return (
    <Grid item display="flex" alignItems="center" flexGrow={1} marginLeft={2}>
      {directoryPath.length > 1 && (
        <Button label="home" onClick={() => handleFolderNavClick(-1)} />
      )}
      {directoryPath.map(
        (path, index) =>
          path !== "files" && (
            <Box key={`${path}-${index}`} display="flex" alignItems="center">
              <ArrowForwardIosIcon color="primary" sx={{ width: 14 }} />
              <Button
                key={`${path}-${index}`}
                label={path}
                onClick={() => handleFolderNavClick(index)}
              />
            </Box>
          ),
      )}
    </Grid>
  );
};
