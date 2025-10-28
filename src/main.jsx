import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HelmetProvider } from "react-helmet-async";

// Crear el HTTP link para el endpoint GraphQL
const httpLink = new HttpLink({
  // endpoint GraphQL
  // uri: "https://graphqlzero.almansi.me/api",
  // uri: "http://milani.local/graphql",
  uri: import.meta.env.VITE_WORDPRESS_GRAPHQL_URL,
});

// Crear instancia del apollo client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(), // sistema para manejar el cache
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
