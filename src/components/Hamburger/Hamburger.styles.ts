import { Button, styled } from "@mui/material";

export const Box = styled(Button)(
  ({ theme }) => `
  pointer-events: auto;
  z-index: 1;
  min-width: 0px;

  // ${theme.breakpoints.up("md")} {
  //   display: none;
  // }

  
`
);

export const Buns = styled("div")(
  ({ theme }) => `

  height: 1.75em;
  display: flex;
  flex-direction: column;
  justify-content: center;


`
);

export const Patty = styled("div")<{ open?: boolean, duration?: number }>(
  ({ theme, open, duration=0.25 }) => `

  height: 2px;
  flex-shrink: 0;
  margin: 2px 0;
  width: 20px;
  background-color: ${theme.palette.text.primary};
  border-radius: 5px;

  transition: margin ${duration}s ${duration}s, rotate ${duration}s, opacity 0s ${duration}s;

  ${open && `

    transition: margin ${duration}s, rotate ${duration}s ${duration}s, opacity 0s ${duration}s;

    &:nth-child(1) {
      margin: -2px 0px;
      rotate: 45deg;

    }
    &:nth-child(2) {
      margin: 0px;
      opacity: 0;

    }
    &:nth-child(3) {
      margin: -2px 0px;
      rotate: -45deg;

    }

  `}

`
);
