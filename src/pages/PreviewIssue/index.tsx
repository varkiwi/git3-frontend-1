import { Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import { Button } from "components/Button";
import { TextField } from "components/TextField";
import { Timeline } from "components/Timeline";
import * as React from "react";

export const PreviewIssue: React.FC = () => {
  return (
    <Container>
      <Box marginTop={5} marginBottom={2} display="flex">
        <Typography variant="h2">
          Error choosing transfer from / to BSC
        </Typography>
        <Typography variant="h2" color="text.secondary" marginLeft={1}>
          #56
        </Typography>
      </Box>
      <Chip label="Open" color="secondary" />
      <Timeline />
      <Grid
        container
        flexDirection="column"
        gap={2}
        padding={3}
        marginBottom={2}
        component={Paper}
      >
        <Grid item>
          <TextField label="Leave a comment" multiline rows={4} fullWidth />
        </Grid>
        <Grid item>
          <TextField
            label="Add Bounty"
            sx={{ display: "block", float: "right" }}
          />
        </Grid>
      </Grid>
      <Button
        label="Comment"
        size="small"
        color="secondary"
        variant="contained"
        sx={{ float: "right" }}
      />
    </Container>
  );
};
