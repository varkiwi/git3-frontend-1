import { AppBar, styled } from "@mui/material";

export const CustomizedAppBar = styled(AppBar)(
  ({ theme }) => `
    padding:8px 16px;
    border-bottom: 1px solid ${theme.palette.primary.main};
    img {
        height: 60px;
        cursor: pointer;
    }
  `,
);
