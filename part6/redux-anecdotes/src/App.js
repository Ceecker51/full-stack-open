import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from './reducers/anecdoteReducer';

import AnecdoteForm from './components/AnecdoteForm';

const App = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => state);

  const vote = (id) => {
    dispatch(voteAnecdote(id));
  };

  const sortByVotes = (a, b) => {
    if (a.votes > b.votes) {
      return -1;
    } else if (a.votes < b.votes) {
      return 1;
    }

    return 0;
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.sort(sortByVotes).map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <AnecdoteForm />
    </div>
  );
};

export default App;
