import { HospitalEntry } from '../types';

interface HospitalProps {
  entry: HospitalEntry;
}

const Hospital = ({ entry }: HospitalProps) => {
  return (
    <div>
      <div>{entry.discharge.date}</div>
      <div>{entry.discharge.criteria}</div>
    </div>
  );
};

export default Hospital;
