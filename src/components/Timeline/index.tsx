import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Paper } from "@mui/material";
import * as React from "react";
import { CustomizedTimeline } from "./styled";

export const Timeline: React.FC = () => {
  return (
    <CustomizedTimeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam id
            quos eveniet facilis quia ipsam. Animi voluptas et nostrum
            doloremque officia voluptatibus! Mollitia dolores delectus, numquam
            libero perferendis optio voluptatem?
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam id
            quos eveniet facilis quia ipsam. Animi voluptas et nostrum
            doloremque officia voluptatibus! Mollitia dolores delectus, numquam
            libero perferendis optio voluptatem?
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam id
            quos eveniet facilis quia ipsam. Animi voluptas et nostrum
            doloremque officia voluptatibus! Mollitia dolores delectus, numquam
            libero perferendis optio voluptatem?
          </Paper>
        </TimelineContent>
      </TimelineItem>
    </CustomizedTimeline>
  );
};
