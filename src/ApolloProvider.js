import React from "react";
import App from "./App";
import { setContext } from "apollo-link-context";
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://sociogram-server.herokuapp.com/"
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
