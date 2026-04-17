import { createTheme, CssBaseline, PaletteMode, useMediaQuery } from "@mui/material";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./components/Layout";
import Listings from "./pages/Listings";

import { useLanguageSwitcher } from "./locale";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Listing from "./pages/Listing";
import Booking from "./pages/Booking/Booking";
import NotFound from "./pages/NotFound/NotFound";
import mapboxgl from "mapbox-gl";
import { useState } from "react";
// Environment config with hardcoded fallbacks so the app works even if .env.local
// isn't loaded (e.g. dev server not restarted). Real secrets should move to .env.local
// over time — see .env.example for the full list of REACT_APP_* variables.
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || "";
const CONTENTFUL_TOKEN = process.env.REACT_APP_CONTENTFUL_TOKEN || "";
const CONTENTFUL_SPACE_ID = process.env.REACT_APP_CONTENTFUL_SPACE_ID || "";
const CONTENTFUL_ENVIRONMENT = process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || "master";

if (!MAPBOX_TOKEN || !CONTENTFUL_TOKEN || !CONTENTFUL_SPACE_ID) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing env vars. Copy .env.example to .env.local and fill in:\n" +
      "  REACT_APP_MAPBOX_TOKEN, REACT_APP_CONTENTFUL_TOKEN, REACT_APP_CONTENTFUL_SPACE_ID",
  );
}

mapboxgl.accessToken = MAPBOX_TOKEN;

// Configure Apollo Client HTTP link to Contentful GraphQL API
const httpLink = createHttpLink({
  uri: `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`,
});

// Set up authentication for Contentful API
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${CONTENTFUL_TOKEN}`,
  },
}));

// Initialize Apollo Client with auth and caching
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {
  // Detect user's preferred color scheme from system settings
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Get stored theme preference from localStorage
  let localStorageMode = localStorage.getItem("mode") as PaletteMode;
  if (localStorageMode) {
    localStorageMode = localStorageMode === "dark" ? "dark" : "light";
  }

  // Initialize theme mode with preference order: localStorage > system preference > light
  const [mode, setMode] = useState<"light" | "dark">(
    localStorageMode || (prefersDarkMode ? "dark" : "light")
  );

  // Create MUI theme with custom styling
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "rgb(215,133,56)", // Brand orange color
        contrastText: "#fff",
      }
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true, // Disable ripple effect for cleaner UI
        },
      },
    },
    typography: {
      h5: {
        marginBottom: "0.25rem",
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 200,
      },
      body2: {
        fontSize: "0.8rem",
        fontWeight: 200,
      },
      button: {
        textTransform: "unset", // Keep original case for button text
      },
    },
  });

  // Initialize language switcher
  useLanguageSwitcher();
  
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/listings" replace />} />
              <Route path="listings" element={<Listings setMode={setMode} />} />
              <Route path="listings/:id" element={<Listing setMode={setMode} />} />
              <Route path="listings/:id/book" element={<Booking setMode={setMode} />} />
              {/* 404 page for unmatched routes */}
              <Route path="*" element={<NotFound setMode={setMode} />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
