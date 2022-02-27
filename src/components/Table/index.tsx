import * as React from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CustomizedTable } from "./styled";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { CodeTableRow } from "interfaces/RowData";

function createData(name: string, commitMessage: string, commitTime: string) {
  return { name, commitMessage, commitTime };
}

const rows = [
  createData("Frozen yoghurt", "159", "6.0"),
  createData("Ice cream sandwich", "237", "9.0"),
  createData("Eclair", "262", "16.0"),
  createData("Cupcake", "305", "3.7"),
  createData("Gingerbread", "356", "16.0"),
];

interface TableProps {
  handleRowClick: (row: CodeTableRow) => void;
}

export const Table: React.FC<TableProps> = (props) => {
  const { handleRowClick } = props;

  return (
    <TableContainer component={Paper}>
      <CustomizedTable>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Commit message</TableCell>
            <TableCell align="right">Commit time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => handleRowClick(row)}
            >
              <TableCell component="th" scope="row">
                <FolderOpenOutlinedIcon />
                {row.name}
              </TableCell>
              <TableCell align="center">{row.commitMessage}</TableCell>
              <TableCell align="right">{row.commitTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </CustomizedTable>
    </TableContainer>
  );
};
