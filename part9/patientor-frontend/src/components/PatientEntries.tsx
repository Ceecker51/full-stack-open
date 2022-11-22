import { Button } from '@material-ui/core';

import { useStateValue } from '../state';

import PatientEntry from './PatientEntry';

const PatientEntries = () => {
  const [{ patient }] = useStateValue();

  if (!patient) {
    return null;
  }

  return (
    <div>
      <h2>entries</h2>
      <div>
        {patient.entries.map((entry) => (
          <PatientEntry key={entry.id} entry={entry} />
        ))}
      </div>
      <Button variant="contained" color="primary">
        Add new Entry
      </Button>
    </div>
  );
};

export default PatientEntries;
