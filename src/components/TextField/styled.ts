import { styled, TextField } from "@mui/material";

export const CustomizedTextField = styled(TextField)(
  ({ theme }) => `
    background-color: ${theme.palette.background.default};
    label {
        font-size: 14px;
    }
  `,
);
