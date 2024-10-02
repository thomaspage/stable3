import { Box, Buns, Patty } from "./Hamburger.styles";
import { HamburgerTypes } from "./Hamburger.types";


const Hamburger = ({
    open,
    onClick,
    ...props
}: HamburgerTypes) => {

    return (
        <Box color="inherit" onClick={onClick} {...props}>
          <Buns>
            <Patty open={open} />
            <Patty open={open} />
            <Patty open={open} />
          </Buns>
        </Box>
    )
}

export default Hamburger;