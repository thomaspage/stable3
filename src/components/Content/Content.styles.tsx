import { styled } from "@mui/material/styles";

export const ContentContainer = styled('div')(({theme}) => ({
    width: "100%",
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    zIndex: 0,
    height: "100%",
    alignSelf: "center",
    position: "relative",
    overflowX: "hidden",

    [theme.breakpoints.down('md')]: {
        // height: 'unset',
        // margin: 'auto',
    }    
}));
