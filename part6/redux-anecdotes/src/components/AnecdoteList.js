import { useSelector, useDispatch } from 'react-redux';

import { voteAnecdote } from '../reducers/anecdoteReducer';
import {
  setNotification,
  removeNotification,
} from '../reducers/notificationReducer';

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
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return filter
      ? anecdotes.filter((anecdote) => anecdote.content.includes(filter))
      : anecdotes;
  });

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id));
    dispatch(setNotification(`you voted ${anecdote.content}`));
    setTimeout(() => dispatch(removeNotification()), 5000);
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
      {anecdotes.sort(sortByVotes).map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
