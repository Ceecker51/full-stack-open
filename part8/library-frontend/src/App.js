import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import SetBirthyear from "./components/SetBirthyear";
import Recommend from "./components/Recommend";

import { BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert("A new book was added.");
      console.log(subscriptionData);
    },
  });

  const logout = () => {
    client.resetStore();
    localStorage.clear();
    setToken(null);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <button onClick={() => setPage("add")}>add book</button>
        ) : null}
        {token ? (
          <button onClick={() => setPage("recommend")}>recommend</button>
        ) : null}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />
      <SetBirthyear show={page === "authors" && token} />
      <Books show={page === "books"} />
      <NewBook show={page === "add" && token} />
      <Recommend show={page === "recommend" && token} />
      <LoginForm show={page === "login" && !token} setToken={setToken} />
    </div>
  );
};

export default App;
