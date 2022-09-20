import { createSlice } from '@reduxjs/toolkit';

import anecdoteService from '../services/anecdotes';

const sortByVotes = (a, b) => {
  if (a.votes > b.votes) {
    return -1;
  } else if (a.votes < b.votes) {
    return 1;
  }

  return 0;
};

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    updateAnecdote(state, action) {
      const id = action.payload.id;
      return state
        .map((anecdote) => (anecdote.id !== id ? anecdote : action.payload))
        .sort(sortByVotes);
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload.sort(sortByVotes);
    },
  },
});

export const { updateAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState();
    const anecdoteToChange = anecdotes.find((anecdote) => anecdote.id === id);
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1,
    };
    await anecdoteService.update(id, changedAnecdote);
    dispatch(updateAnecdote(changedAnecdote));
  };
};

export default anecdoteSlice.reducer;
