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
interface TableProps {
  handleRowClick: (row: CodeTableRow) => void;
  data: any;
  showFileContent: boolean;
}

export const Table: React.FC<TableProps> = (props) => {
  const { handleRowClick, data } = props;

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
          {data?.map((row: any) => (
            <TableRow
              key={row.cid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => handleRowClick(row)}
            >
              <TableCell component="th" scope="row">
                <FolderOpenOutlinedIcon />
                {row.name}
              </TableCell>
              <TableCell align="center">{row.commit_message}</TableCell>
              <TableCell align="right">{row.commit_time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </CustomizedTable>
    </TableContainer>
  );
};
