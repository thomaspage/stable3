import { styled } from "@mui/material/styles";

export const ContentContainer = styled('div')(({theme}) => ({
    width: "100%",
    // padding: "10px 25px",
    // minHeight: '60vh',
    // maxHeight: '70vh',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    zIndex: 0,
    height: "100%",
    alignSelf: "center",
    position: "relative",
    // margin: 'auto unset',

    // border: '1px solid lightgrey',
    
    // " > div": {
    //     paddingTop: 50,
    //     paddingBottom: 50,
    // },

    [theme.breakpoints.down('md')]: {
        // height: 'unset',
        // margin: 'auto',
    }    
}));
