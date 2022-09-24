import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import Select from 'react-select';

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const SetBirthyear = (props) => {
  const [nameOption, setNameOption] = useState(null);
  const [born, setBorn] = useState('');

  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  let options = [];

  if (!props.show) {
    return null;
  }

  if (!result.loading) {
    options = result.data.allAuthors.map((a) => {
      return { value: a.name, label: a.name };
    });
  }

  const submit = (event) => {
    event.preventDefault();

    if (!(nameOption && born)) {
      return;
    }

    editAuthor({ variables: { name: nameOption.value, born: Number(born) } });

    setNameOption(null);
    setBorn('');
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            value={nameOption}
            options={options}
            onChange={(selectedOption) => setNameOption(selectedOption)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirthyear;
