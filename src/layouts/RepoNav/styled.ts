import { TabList } from "@mui/lab";
import { Paper, styled } from "@mui/material";

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
  ({ theme }) => `
    display:flex;
    justify-content:space-between;
  `,
);

export const CustomizedModalContent = styled(Paper)(
  ({ theme }) => `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
  `,
);
