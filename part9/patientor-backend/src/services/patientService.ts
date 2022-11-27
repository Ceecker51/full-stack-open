import { v1 as uuid } from 'uuid';

import patients from '../../data/patients';

import {
  Entry,
  EntryWithoutId,
  NewPatient,
  Patient,
  PublicPatient,
} from '../types';

const getEntries = (): Patient[] => {
  return patients;
};

const getPublicEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find((patient) => patient.id === id);
  return patient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = findById(patientId);

  if (!patient) {
    throw new Error('Incorrect patient id');
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default { getEntries, getPublicEntries, addPatient, findById, addEntry };
