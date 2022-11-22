import { HealthCheckEntry } from '../types';

interface HealthCheckProps {
  entry: HealthCheckEntry;
}

const HealthCheck = ({ entry }: HealthCheckProps) => {
  return <div>{entry.healthCheckRating}</div>;
};

export default HealthCheck;
