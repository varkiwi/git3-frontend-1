import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  LinearProgress,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { CustomizedTable } from "./styled";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { CodeTableRow } from "interfaces/Table/CodeTableRow";
import { TableHeaders } from "interfaces/Table/TableHeaders";
import { TablePaginationActions } from "./TablePaginationActions";
interface TableProps {
  handleRowClick: (row: CodeTableRow) => void;
  data: any;
  tableHeaders: TableHeaders[];
  loadingData: boolean;
  isPagination: boolean;
}

export const Table: React.FC<TableProps> = (props) => {
  const { handleRowClick, data, tableHeaders, loadingData, isPagination } =
    props;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <CustomizedTable>
        <TableHead>
          <TableRow>
            {tableHeaders.map((row) => (
              <TableCell key={row.header} align={row.align}>
                {row.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row: any, index: number) => (
            <TableRow
              key={`${row[tableHeaders[0].value]} ${index}`}
              onClick={() => handleRowClick(row)}
            >
              <TableCell component="th" scope="row">
                {row.type &&
                  (row.type === "file" ? (
                    <InsertDriveFileOutlinedIcon />
                  ) : (
                    <FolderOpenOutlinedIcon />
                  ))}
                {row[tableHeaders[0].value]}
              </TableCell>
              <TableCell align="center">{row[tableHeaders[1].value]}</TableCell>
              <TableCell align="right">{row[tableHeaders[2].value]}</TableCell>
            </TableRow>
          ))}
          {loadingData ? (
            <TableRow>
              <TableCell colSpan={12} align="center">
                <Box padding={5}>
                  <LinearProgress color="secondary" />
                  <Typography sx={{ marginTop: 2 }}>Loading data</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography sx={{ padding: 5 }}>No data</Typography>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
        {isPagination && data.length > 0 && (
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        )}
      </CustomizedTable>
    </TableContainer>
  );
};
