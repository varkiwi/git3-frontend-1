import { LoadingButtonProps } from "@mui/lab";
import * as React from "react";
import { CustomizedButton } from "./styled";

interface ExtendedButtonProps extends LoadingButtonProps {
  label: string;
}

export const Button: React.FC<ExtendedButtonProps> = (props) => {
  const { label, ...btnProps } = props;

  return (
    <CustomizedButton loadingPosition="start" {...btnProps}>
      {label}
    </CustomizedButton>
  );
};
