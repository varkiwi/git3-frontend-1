import { ButtonProps, Grid, Paper, Typography } from "@mui/material";
import * as React from "react";

export const File: React.FC = () => {
  const fileContent = ["Hi Kod", "I love you code"];

  return (
    <Paper>
      <Grid container flexDirection="column" padding={2}>
        {fileContent.map((line, index) => (
          <Grid item display="flex" key={index}>
            <Typography variant="body2" color="primary" sx={{ marginRight: 2 }}>
              {index + 1}
            </Typography>
            <Typography variant="body2">{line}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
