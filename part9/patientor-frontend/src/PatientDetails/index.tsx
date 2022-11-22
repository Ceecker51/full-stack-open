import React from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom';

import { apiBaseUrl } from '../constants';
import { Entry, Patient } from '../types';
import { updatePatient, useStateValue } from '../state';

interface Props {
  entry: Entry;
}

const PatientEntry = ({ entry }: Props) => {
  const [{ diagnosis }] = useStateValue();

  return (
    <div>
      <div>
        {entry.date} {entry.description}
      </div>
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>{code} {diagnosis[code].name}</li>
        ))}
      </ul>
    </div>
  );
};

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
    </div>
  );
};

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        return;
      }

      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    if (patient && patient.id === id) {
      return;
    } else {
      void fetchPatient();
    }
  }, [dispatch]);

  const getGenderSign = (gender: string): string => {
    if (gender === 'male') {
      return '\u2642';
    } else if (gender === 'female') {
      return '\u2640';
    } else {
      return '\u9906';
    }
  };

  if (!patient) {
    return null;
  }

  return (
    <div>
      <h1>
        {patient.name} {getGenderSign(patient.gender)}
      </h1>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <PatientEntries />
    </div>
  );
};

export default PatientDetails;
