const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id;
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote
      );

    case 'NEW_ANECDOTE':
      return [...state, action.data];

    case 'SET_ANECDOTES':
      return action.data;

    default:
      return state;
  }
};

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id },
  };
};

export const createAnecdote = (anecdote) => {
  return {
    type: 'NEW_ANECDOTE',
    data: anecdote,
  };
};

export const setAnecdotes = (anecdotes) => {
  return {
    type: 'SET_ANECDOTES',
    data: anecdotes,
  };
};

export default reducer;
