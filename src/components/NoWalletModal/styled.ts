import { Paper, styled } from "@mui/material";

export const CustomizedModalContent = styled(Paper)(
  () => `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2rem;
    `,
);
