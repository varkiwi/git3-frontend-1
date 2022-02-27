import { ButtonProps } from "@mui/material";
import * as React from "react";
import { CustomizedButton } from "./styled";

interface ExtendedButtonProps extends ButtonProps {
  label: string;
}

export const Button: React.FC<ExtendedButtonProps> = (props) => {
  const { label, ...btnProps } = props;

  return <CustomizedButton {...btnProps}>{label}</CustomizedButton>;
};
