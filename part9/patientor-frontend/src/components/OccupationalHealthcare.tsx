import { OccupationalHealthcareEntry } from '../types';

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
}

const OccupationalHealthcare = ({ entry }: OccupationalHealthcareProps) => {
  return (
    <div>
      <div>{entry.sickLeave?.startDate}</div>
      <div>{entry.sickLeave?.endDate}</div>
    </div>
  );
};

export default OccupationalHealthcare;
