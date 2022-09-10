import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => state.anecdotes);

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
      {anecdotes.sort(sortByVotes).map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => dispatch(voteAnecdote(anecdote.id))}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
