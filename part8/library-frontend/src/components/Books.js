import { useEffect, useState } from "react";
import { useQuery, useApolloClient } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const union = (a, b) => {
  const result = a.concat(b);
  const resultSet = new Set(result);
  return [...resultSet];
};

const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filterGenre, setFilterGenre] = useState("");
  const [bookCount, setBookCount] = useState(-1);

  const client = useApolloClient();
  const result = useQuery(ALL_BOOKS, { variables: { genre: filterGenre } });

  const updateGenres = () => {
    const allGenres = result.data.allBooks
      .map((book) => book.genres)
      .reduce(union);

    setGenres(allGenres);
    setBookCount(result.data.allBooks.length);
  };

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);

      if (genres.length === 0) {
        updateGenres();
      }
    }
  }, [result, filterGenre]);

  const updateFilter = async (genre) => {
    await result.refetch({ genre });
    setFilterGenre(genre);
  };

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      {filterGenre ? (
        <div>
          in genre <b>{filterGenre}</b>
        </div>
      ) : null}

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => updateFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => updateFilter("")}>all genres</button>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
