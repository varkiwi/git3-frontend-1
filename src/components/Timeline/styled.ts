import { Timeline } from "@mui/lab";
import { styled } from "@mui/material";

export const CustomizedTimeline = styled(Timeline)(
  ({ theme }) => `
    align-items: flex-start;
    .MuiTimelineItem-root {
      width: 100%;
      &:first-of-type {
        .MuiPaper-root {
          border: 1px solid ${theme.palette.text.primary};
        }
      }
    }
    .MuiTimelineItem-root:before {
      flex: 0;
    }
    .MuiPaper-root {
      font-size: 14px;
      font-weight: 400;
      padding: 16px;
    }
    .MuiDivider-root {
      margin:8px 0;
    }
  `,
);
