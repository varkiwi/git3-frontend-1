import { AppBar, styled } from "@mui/material";

export const CustomizedAppBar = styled(AppBar)(
  ({ theme }) => `
    padding:8px 16px;
    border-bottom: 1px solid ${theme.palette.primary.main};
    img {
        height: 60px;
        cursor: pointer;
    }
    .MuiIconButton-root {
      display: none;
    }

    @media only screen and (max-width: 560px) {
      .MuiToolbar-root {
        padding:0;
      }
      .MuiButton-root {
        padding: 8px 11px;
      }
      .MuiIconButton-root {
        display: block;
      }
      .MuiAutocomplete-root {
        display: none;
      }
    }
  `,
);
