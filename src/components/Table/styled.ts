import { styled, Table } from "@mui/material";

export const CustomizedTable = styled(Table)(
  () => `
    .MuiTableRow-root:last-child {
      .MuiTableCell-root {
        border: none;
      }
    }
    .MuiTableCell-root {
        border-color:rgba(255, 255, 255, 0.12);
        .MuiSvgIcon-root {
            vertical-align:bottom;
            margin-right:1rem;
        }
    }
    tbody .MuiTableRow-root {
      cursor: pointer;
    }
    .MuiNativeSelect-icon {
      right: -15px;
    }
    .MuiTableHead-root {
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }
    .MuiTableFooter-root {
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }
  `,
);
