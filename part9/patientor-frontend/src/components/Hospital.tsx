import { HospitalEntry } from '../types';

import { LocalHospital } from '@mui/icons-material';

interface HospitalProps {
  entry: HospitalEntry;
}

const Hospital = ({ entry }: HospitalProps) => {  
  return (
    <div>
       <div>
        {entry.date} <LocalHospital />
      </div>
      <div><em>{entry.description}</em></div>
      <div>diagnose by {entry.specialist}</div>
    </div>
  );
};

export default Hospital;
