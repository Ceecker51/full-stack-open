import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { apiBaseUrl } from '../constants';
import { Diagnosis, Patient } from '../types';
import { setDiagnosisList, updatePatient, useStateValue } from '../state';

import PatientEntries from '../components/PatientEntries';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patient }, dispatch] = useStateValue();

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id !== undefined ? id : ''}`
        );
        dispatch(updatePatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    void fetchDiagnosisList();

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

  // #################### Render #################### 

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
