import { Grid, Paper, Typography } from "@mui/material";
import { FileContent } from "interfaces/FileContent";
import * as React from "react";

interface FileProps {
  fileContent: Array<FileContent>;
}

export const File: React.FC<FileProps> = (props) => {
  const { fileContent } = props;

  return (
    <Paper>
      <Grid container flexDirection="column" padding={2}>
        {fileContent?.map((row: FileContent) => (
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
