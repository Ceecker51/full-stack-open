import { useStateValue } from '../state';
import { Entry } from '../types';

import EntryDetails from './EntryDetails';

interface Props {
  entry: Entry;
}

const PatientEntry = ({ entry }: Props) => {
  const [{ diagnosis }] = useStateValue();

  return (
    <div
      style={{
        marginBottom: '10px',
        border: '1px solid black',
        borderRadius: '12px',
        padding: '5px',
      }}
    >
      <div>
        {entry.date} {entry.type}
      </div>
      <div>{entry.description}</div>
      <EntryDetails entry={entry} />
      <div>diagnose by {entry.specialist}</div>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={code}>
              {code} {diagnosis[code].name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientEntry;
