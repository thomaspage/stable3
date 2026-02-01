import Header from "components/Header";
import { Button, Container, PaletteMode } from "@mui/material";
import { NotFoundContainer, NotFoundTitle, NotFoundBody, NotFoundCard } from "./NotFound.styles";

const NotFound = ({ setMode }: { setMode?: (mode: PaletteMode) => void }) => {
  return (
    <>
      {/* Header placed above the content window so it matches single-listing layout */}
      <Container maxWidth="lg">
        <Header setMode={setMode} alignWithContainer />
      </Container>

      <Container maxWidth="lg">
        <NotFoundContainer>
          <NotFoundCard>
            <NotFoundTitle variant="h4">Sorry :( <p>This link does not exist</p></NotFoundTitle>
            <NotFoundBody>
              Sorry, we couldn't find the page you were looking for. <p>Let's get you back on track, visit the
              listings page to continue.</p>
            </NotFoundBody>

            <Button
              variant="contained"
              color="primary"
              size="large"
              href="#/listings"
            >
              View Listings
            </Button>
          </NotFoundCard>
        </NotFoundContainer>
      </Container>
    </>
  );
};

export default NotFound;