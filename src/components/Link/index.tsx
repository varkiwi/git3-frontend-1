import { LinkBaseProps } from "@mui/material";
import * as React from "react";
import { CustomizedLink } from "./styled";

interface LinkProps extends LinkBaseProps {
  label: string;
}

export const Link: React.FC<LinkProps> = (props) => {
  const { label, ...linkProps } = props;
  return (
    <CustomizedLink variant="body1" target="_blank" {...linkProps}>
      {label}
    </CustomizedLink>
  );
};
