import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material";

export const CustomizedButton = styled(LoadingButton)(
  ({ theme }) => `
    font-size: 15px;
    font-weight:600;
    border-radius: 6px;
    text-transform: none;
    &.MuiButton-outlinedSecondary {
      color: ${theme.palette.text.primary};
      border: 1px solid ${theme.palette.secondary.main};
      svg {
        color: ${theme.palette.secondary.main};
      }
    }
    &.MuiButton-outlinedPrimary {
      color: ${theme.palette.text.primary};
      border: 1px solid ${theme.palette.primary.main};
    }
    &.MuiButton-sizeSmall {
      padding:4px 15px;
    }
    .MuiLoadingButton-loadingIndicator {
      position: static;
      margin: -2px 7px 0 0;
    }
  `,
);
