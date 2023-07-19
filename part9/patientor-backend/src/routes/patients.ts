import express from 'express';

import patientService from '../services/patientService';
import { toNewPatient, toEntryWithoutId } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPublicEntries());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);

    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).send(errorMessage);
  }
});

router.get('/:id', (req, res) => {
  const id = String(req.params.id);
  const patient = patientService.findById(id);

  if (patient) {
    res.send(patient);
  } else {
    res.status(404);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const id = String(req.params.id);
    const newEntry = toEntryWithoutId(req.body);
    const addedEntry = patientService.addEntry(id, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).send(errorMessage);
  }
});

export default router;
