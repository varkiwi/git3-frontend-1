import { TabList } from "@mui/lab";
import { styled } from "@mui/material";

export const CustomizedTabList = styled(TabList)(
  ({ theme }) => `
    min-height: 42px;
    .MuiTab-root {
        line-height: normal;
        min-height: auto;
        color: ${theme.palette.text.secondary};
        text-transform:none;
        svg {
          height: 22px;
          width: 22px;
        }
        &.Mui-selected {
            color:${theme.palette.text.primary};
            font-weight:600;
        }
    }
  `,
);

export const RepoNavHeader = styled("div")(
  () => `
    display:flex;
    justify-content:space-between;
  `,
);
