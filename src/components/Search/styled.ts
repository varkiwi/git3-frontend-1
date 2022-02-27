import { Autocomplete, styled } from "@mui/material";

export const CustomizedAutocomplete = styled(Autocomplete)(
  ({ theme }) => `
        width:220px;
        .MuiInputBase-input {
            font-size: 14px;
        }
        .MuiInputLabel-root {
            color: ${theme.palette.primary.main};
            font-size: 14px;
        }
    `,
);
