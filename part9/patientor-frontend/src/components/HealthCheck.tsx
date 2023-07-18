import { HealthCheckEntry } from '../types';

import { Favorite, MedicalServices } from '@mui/icons-material';

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

const HealthCheck = ({ entry }: HealthCheckProps) => {

  const healthCheckRatingColor = (healthCheckRating: number) => {
    if (healthCheckRating === 0) {
      return {fill: "green"};
    } else if (healthCheckRating === 1) {
      return {fill: "yellow"};
    }

    return {fill: "black"};
  };

  return (
    <div>
      <div>{entry.date} <MedicalServices /></div>
      <div><em>{entry.description}</em></div>
      <Favorite style={healthCheckRatingColor(entry.healthCheckRating)} />
      <div>diagnose by {entry.specialist}</div>
  </div>
  );
};

export default HealthCheck;
