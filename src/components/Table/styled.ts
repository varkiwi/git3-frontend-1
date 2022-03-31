import { styled, Table } from "@mui/material";

export const CustomizedTable = styled(Table)(
  ({ theme }) => `
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
  `,
);
