import { Container, Grid, Paper } from "@mui/material";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import * as React from "react";

export const NewIssue: React.FC = () => {
  return (
    <Container>
      <Grid
        container
        flexDirection="column"
        justifyContent="space-between"
        gap={2}
        marginTop={4}
        marginBottom={2}
        padding={3}
        component={Paper}
      >
        <Grid item>
          <TextField label="Title" maxRows={4} fullWidth />
        </Grid>
        <Grid item>
          <TextField label="Leave a comment" multiline rows={4} fullWidth />
        </Grid>
        <Grid item>
          <TextField label="Bounty" sx={{ float: "right" }} />
        </Grid>
      </Grid>
      <Button
        label="Submit issue"
        size="small"
        color="secondary"
        variant="contained"
        sx={{ float: "right" }}
      />
    </Container>
  );
};
