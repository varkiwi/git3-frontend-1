import { LoadingButtonProps } from "@mui/lab";
import * as React from "react";
import { CustomizedButton } from "./styled";
import { CircularProgress } from "@mui/material";

interface ExtendedButtonProps extends LoadingButtonProps {
  label: string;
}

export const Button: React.FC<ExtendedButtonProps> = (props) => {
  const { label, ...btnProps } = props;

  return (
    <CustomizedButton
      {...btnProps}
      startIcon={
        btnProps.startIcon ? (
          btnProps.startIcon
        ) : (
          <CircularProgress sx={{ display: "none", margin: 0 }} />
        )
      }
      loadingPosition="start"
    >
      {label}
    </CustomizedButton>
  );
};
