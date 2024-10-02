import { createTheme, useMediaQuery } from "@mui/material";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./components/Layout";
import Listings from "./pages/Listings";
import Home from "./pages/Home";
import { useLanguageSwitcher } from "./locale";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Listing from "./pages/Listing";
import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhvbWFzLXN0YWJsMyIsImEiOiJjbHUwN2J3dzQwMW1xMm1vMnM2ODR4ZDVoIn0.kTfOf3AxVhvuTBIN6w6k1w";

export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxgzAIEWC2Ijq3_ot56bgIWB7QEBh0mTY0xW1BLUbMtZS6WCm-F7tLbfQ0wYBoC5JLs9A/exec";

// const httpLink = new HttpLink({ uri: 'https://graphql.contentful.com/content/v1/spaces/w7j40su7ulcx/environments/master' });

// const authLink = new ApolloLink((operation, forward) => {
//   // Retrieve the authorization token from local storage.
//   // const token = localStorage.getItem('auth_token');
//   const token = "n22SMrCTD8Bc9wF1gldo00rsTLukTCy17yYuclaCCRU"

//   // Use the setContext method to set the HTTP headers.
//   operation.setContext({
//     headers: {
//       authorization: token ? `Bearer ${token}` : ''
//     }
//   });

//   // Call the next link in the middleware chain.
//   return forward(operation);
// });

const httpLink = createHttpLink({
  uri: "https://graphql.contentful.com/content/v1/spaces/w7j40su7ulcx/environments/master",
});

const authLink = setContext((_, { headers }) => {
  const token = "n22SMrCTD8Bc9wF1gldo00rsTLukTCy17yYuclaCCRU";

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  // uri: "https://graphql.contentful.com/content/v1/spaces/w7j40su7ulcx/environments/master",
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = createTheme({
    palette: {
      mode,
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
    typography: {
      h1: {
        // fontSize: '2rem',
        // fontWeight: 500,
      },
      h2: {
        // fontSize: '1.4rem',
        // fontWeight: 500,
        // lineHeight: "1.5em",
      },
      h3: {
        // fontSize: '1.2rem',
        // fontWeight: 600,
        // lineHeight: "1.5em",
      },
      h4: {
        // fontFamily: "Ballantines",
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
        textTransform: "unset",
      },
      // fontFamily: [
      //   // 'PPHatton',
      //   'serif',
      // ].join(",")
    },
  });

  // Toggle light/dark mode (for testing)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setMode(mode === "light" ? "dark" : "light");
  //   }, 10000);
  // }, [mode]);

  useLanguageSwitcher();
  // theme.palette.
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/listings" replace />} />
              <Route path="listings" element={<Listings />} />
              <Route path="listings/:id" element={<Listing />} />

              {/* Redirect to home */}
              {/* Replace with 404 */}
              <Route path="*" element={<Navigate to="/listings" replace />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
