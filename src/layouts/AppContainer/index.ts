import { styled } from "@mui/material";

export const AppContainer = styled("div")(
  ({ theme }) => `
    background-color:#121212;
    padding:24px 32px;
    box-shadow:0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
    background-image: linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09));
    .MuiBox-root > * {
      text-align: center;
    }
  `,
);
