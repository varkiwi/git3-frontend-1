import { Timeline } from "@mui/lab";
import { styled } from "@mui/material";

export const CustomizedTimeline = styled(Timeline)(
  ({ theme }) => `
    align-items: flex-start;
    .MuiTimelineItem-root:before {
      flex: 0;
    }
    .MuiPaper-root {
      font-size: 14px;
      font-weight: 400;
      padding: 16px;
    }
    .MuiTimelineDot-root {
      background-color: ${theme.palette.secondary.main};
    }
  `,
);
