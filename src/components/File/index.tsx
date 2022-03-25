import { ButtonProps, Grid, Paper, Typography } from "@mui/material";
import * as React from "react";

interface FileProps {
  fileContent: any;
}

export const File: React.FC<FileProps> = (props) => {
  const { fileContent } = props;
  // const fileContent = ["Hi Kod", "I love you code"];
  return (
    <Paper>
      <Grid container flexDirection="column" padding={2}>
        {fileContent?.map((row: any) => (
          <Grid item display="flex" key={row.line}>
            <Typography variant="body2" color="primary" sx={{ marginRight: 2 }}>
              {row.line}
            </Typography>
            <Typography variant="body2">{row.text}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
