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
import NotFound from "./pages/NotFound/NotFound";
import mapboxgl from "mapbox-gl";
import { useState } from "react";
import { EXTERNAL_URLS } from "./constants";

// Initialize Mapbox access token
// TODO: Move to environment variable for better security
mapboxgl.accessToken =
  "pk.eyJ1IjoidGhvbWFzLXN0YWJsMyIsImEiOiJjbHUwN2J3dzQwMW1xMm1vMnM2ODR4ZDVoIn0.kTfOf3AxVhvuTBIN6w6k1w";

// Re-export Google Script URL from constants
export const GOOGLE_SCRIPT_URL = EXTERNAL_URLS.GOOGLE_SCRIPT;

// Configure Apollo Client HTTP link to Contentful GraphQL API
const httpLink = createHttpLink({
  uri: "https://graphql.contentful.com/content/v1/spaces/w7j40su7ulcx/environments/master",
});

// Set up authentication for Contentful API
// TODO: Move token to environment variable for better security
const authLink = setContext((_, { headers }) => {
  const token = "n22SMrCTD8Bc9wF1gldo00rsTLukTCy17yYuclaCCRU";

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

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
