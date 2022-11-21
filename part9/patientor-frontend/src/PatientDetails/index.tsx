import React from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom';

import { apiBaseUrl } from '../constants';
import { Patient } from '../types';
import { updatePatient, useStateValue } from '../state';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  //const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        return;
      }

      if (patient?.id === id) {
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
    void fetchPatient();
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
    </div>
  );
};

export default PatientDetails;
