import { Popover, styled } from "@mui/material";

export const CustomizedPopover = styled(Popover)(
  () => `
    padding: "20px";
    .MuiPopover-paper {
        padding: 16px;
        .MuiGrid-item {
            display:flex;
            margin-bottom: 8px;
        }
        .MuiOutlinedInput-input {
            font-size: 14px;          
        }
        .MuiInputAdornment-root {
            cursor: pointer;
        }
        .MuiSvgIcon-root {
          width: 20px;
          height: 20px;
        }
    }
  `,
);
