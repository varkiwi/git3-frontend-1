import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Chip, Paper, Typography, Divider } from "@mui/material";
import { Answer } from "interfaces/Answer";
import React, { useEffect, useState } from "react";
import { CustomizedTimeline } from "./styled";

interface TimelineProps {
  issueStorage: any;
  answers: Array<Answer>;
}

export const Timeline: React.FC<TimelineProps> = (props) => {
  const { issueStorage, answers } = props;

  const [timelineColor, setTimelineColor] = useState<
    "primary" | "secondary" | "error"
  >("primary");

  useEffect(() => {
    switch (issueStorage.state) {
      case "Open":
        setTimelineColor("secondary");
        break;
      case "Closed":
        setTimelineColor("primary");
        break;
      default:
        setTimelineColor("error");
    }
  }, [issueStorage.state]);

  return (
    <>
      <Chip
        key={issueStorage.state}
        label={issueStorage.state}
        color={timelineColor}
      />
      <CustomizedTimeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color={timelineColor} />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper>
              <Typography variant="body2" color="text.secondary">
                {issueStorage.opener} commented
              </Typography>
              <Divider />
              <Typography>{issueStorage.text}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
        {answers.length > 0 &&
          answers?.map((answer, index) => (
            <TimelineItem key={`answer.issueText-${index}`}>
              <TimelineSeparator>
                <TimelineDot color={timelineColor} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper>
                  <Typography variant="body2" color="text.secondary">
                    {answer.author} commented
                  </Typography>
                  <Divider />
                  <Typography>{answer.issueText}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
      </CustomizedTimeline>
    </>
  );
};
