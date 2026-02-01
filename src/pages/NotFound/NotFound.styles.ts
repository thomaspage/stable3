import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const NotFoundContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  // keep the content pane neutral (no grey background)
  backgroundColor: 'transparent',
  padding: '40px 0',
  minHeight: '60vh',
  textAlign: 'center',
}));

export const NotFoundTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  // Reduced bottom margin so title sits closer to the body
  marginBottom: theme.spacing(1),

}));

export const NotFoundBody = styled(Typography)(({ theme }) => ({
  // Slightly smaller bottom margin to tighten spacing between title and body
  marginBottom: theme.spacing(2),
  marginTop: -20,
  maxWidth: 720,
}));

// Card-like outline around the 404 copy that matches the text color
export const NotFoundCard = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: 12,
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // Reduced gap between children so title and body are closer
  gap: theme.spacing(1),
  maxWidth: 720,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',

  

  // Make the card wider on larger screens so it appears more elongated horizontally
  [theme.breakpoints.up('md')]: {
    maxWidth: '1000px',
    padding: '32px 48px',
  },

  [theme.breakpoints.up('lg')]: {
    maxWidth: '1200px',
    padding: '40px 64px',
  },
}));