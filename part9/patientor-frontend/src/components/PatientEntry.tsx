import { Entry } from '../types';
import { useStateValue } from '../state';

interface Props {
  entry: Entry;
}

const PatientEntry = ({ entry }: Props) => {
  const [{ diagnosis }] = useStateValue();

  return (
    <div
      // style={{
      //   marginBottom: '10px',
      //   border: '1px solid black',
      //   borderRadius: '12px',
      //   padding: '5px',
      // }}
    >
      <div>
        {entry.date} {entry.description}
      </div>
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
