import { StandardTextFieldProps } from "@mui/material";
import * as React from "react";
import { CustomizedTextField } from "./styled";

interface ExtendedTextField extends StandardTextFieldProps {
  label: string;
}

export const TextField: React.FC<ExtendedTextField> = (props) => {
  const { label, ...textFieldProps } = props;

  return (
    <CustomizedTextField
      {...textFieldProps}
      variant="outlined"
      size="small"
      label={label}
    />
  );
};
