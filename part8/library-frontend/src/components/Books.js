import { useState } from "react";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [filterGenre, setFilterGenre] = useState("");

  const result = useQuery(ALL_BOOKS, { variables: { genre: filterGenre }});

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const genres = ["refactoring", "agile", "patterns", "design", "classic", "revolution", "crime"];
  const filteredBooks = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      {filterGenre ? (
        <div>
          in genre <b>{filterGenre}</b>
        </div>
      ) : null}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setFilterGenre(genre)}>
            {genre}
          </button>
        ))}

        <button onClick={() => setFilterGenre("")}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
