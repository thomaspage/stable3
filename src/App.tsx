import { createTheme } from "@mui/material";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./components/Layout";
import Listings from "./pages/Listings";
import Home from "./pages/Home";
import RSVP from "./pages/RSVP";
import SecretDinner from "./pages/SecretDinner";
import Schedule from "./pages/Schedule";
import { useLanguageSwitcher } from "./locale";
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxgzAIEWC2Ijq3_ot56bgIWB7QEBh0mTY0xW1BLUbMtZS6WCm-F7tLbfQ0wYBoC5JLs9A/exec";

export const theme = {
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.4rem',
      fontWeight: 500,
      lineHeight: "1.5em",
    },
    h3: {
      fontSize: '1.05rem',
      fontWeight: 500,
      lineHeight: "1.5em",

    },
    h4: {
      fontFamily: "Ballantines",
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 200,
    },
    body2: {
      fontSize: '0.8rem',
      fontWeight: 200,
    },
    fontFamily: [
      'PPHatton',
      'serif',
    ].join(",")
  },
};

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
})

const authLink = setContext((_, { headers }) => {

  const token = "n22SMrCTD8Bc9wF1gldo00rsTLukTCy17yYuclaCCRU"

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})

const client = new ApolloClient({
  // uri: "https://graphql.contentful.com/content/v1/spaces/w7j40su7ulcx/environments/master",
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {

  useLanguageSwitcher();

  return (
    <ApolloProvider client={client}>
    <ThemeProvider theme={createTheme(theme)}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="listings" element={<Listings />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="rsvp" element={<RSVP />} />
              <Route path="welcome-evening" element={<SecretDinner />} />

              {/* Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
    </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
