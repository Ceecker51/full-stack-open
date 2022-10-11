import { useQuery } from "@apollo/client";

import { ALL_BOOKS, ME } from "../queries";

const Recommend = (props) => {
  const resultAllBooks = useQuery(ALL_BOOKS);
  const resultMe = useQuery(ME);

  if (!props.show) {
    return null;
  }

  if (resultAllBooks.loading || resultMe.loading) {
    return <div>loading...</div>;
  }

  const userFavouriteGenre = resultMe.data.me.favouriteGenre;
  const recommendedBooks = resultAllBooks.data.allBooks.filter((book) => book.genres.includes(userFavouriteGenre))

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre <b>{userFavouriteGenre}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
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

export default Recommend;
