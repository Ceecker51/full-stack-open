import { OccupationalHealthcareEntry } from '../types';

import { Work } from '@mui/icons-material';

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcare = ({ entry }: OccupationalHealthcareProps) => {

  return (
    <div>
      <div>
        {entry.date} <Work /> <em>{entry.employerName}</em>
      </div>
      <div><em>{entry.description}</em></div>
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};

export default OccupationalHealthcare;
