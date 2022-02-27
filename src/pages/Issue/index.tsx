import { Container, Grid } from "@mui/material";
import { Button } from "components/Button";
import { Table } from "components/Table";
import { CodeTableRow } from "interfaces/RowData";
import * as React from "react";
import { useHistory } from "react-router-dom";

export const Issue: React.FC = () => {
  const history = useHistory();

  const handleNewIssueClick = () => {
    history.push("/issues/new");
  };
  const handleRowClick = (row: CodeTableRow) => {
    history.push("/issues/1");
  };

  return (
    <Container>
      <Grid container justifyContent="flex-end" marginTop={4} marginBottom={2}>
        <Grid item>
          <Button
            label="New issue"
            size="small"
            color="secondary"
            variant="contained"
            sx={{ float: "right" }}
            onClick={handleNewIssueClick}
          />
        </Grid>
      </Grid>
      <Table handleRowClick={handleRowClick} />
    </Container>
  );
};
