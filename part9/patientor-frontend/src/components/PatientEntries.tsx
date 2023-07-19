import React from "react";
import axios from "axios";

import { Alert } from "@material-ui/lab";
import { Button } from "@material-ui/core";

import { apiBaseUrl } from "../constants";
import { useStateValue, getPatient } from "../state";
import { DateRange, Discharge, EntryWithoutId, Patient} from "../types";

// Components
import PatientEntry from "./PatientEntry";
import AddEntry from "../AddEntry";
import { EntryFormValues } from "../AddEntry/AddEntryForm";

const PatientEntries = () => {
  const [{ patient }, dispatch] = useStateValue();

  const [showEntryForm, setShowEntryForm] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openNewEntryForm = (): void => {
    setShowEntryForm(true);
  };

  const onCloseEntryForm = (): void => {
    setShowEntryForm(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    const createNewEntry = (): EntryWithoutId => {
      const base = {
        type: values.type,
        description: values.description,
        date: values.date,
        specialist: values.specialist,
        diagnosisCodes: values.diagnosticCodes,
      };

      switch (values.type) {
        case "HealthCheck":
          return {
            ...base,
            healthCheckRating: values.healthCheckRating,
          } as EntryWithoutId;
        case "Hospital":
          return {
            ...base,
            discharge: {
              date: values.dischargeDate,
              criteria: values.dischargeCriteria,
            } as Discharge,
          } as EntryWithoutId;
        case "OccupationalHealthcare":
          return {
            ...base,
            employerName: values.employerName,
            sickLeave: {
              startDate: values.sickLeaveStartDate,
              endDate: values.sickLeaveEndDate,
            } as DateRange,
          } as EntryWithoutId;
        default:
          return base as EntryWithoutId;
      }
    };

    if (patient) {
      try {
        const newEntryWithoutId = createNewEntry();
        console.log(newEntryWithoutId);

        const { data: newPatient } = await axios.post<Patient>(
          `${apiBaseUrl}/patients/${patient.id}/entries`,
          newEntryWithoutId
        );
        console.log(newPatient);

        dispatch(getPatient(newPatient));
        onCloseEntryForm();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data || "Unrecognized axios error");
          setError(
            String(error.response?.data) || "Unrecognized axios error"
          );
        } else {
          console.error("Unknown error", error);
          setError("Unknown error");
        }
      }
    }
  };

  // #################### Render ####################

  if (!patient) {
    return null;
  }

  return (
    <div>
      {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
      <AddEntry
        showForm={showEntryForm}
        onClose={onCloseEntryForm}
        onSubmit={submitNewEntry}
      />
      <h2>entries</h2>
      <div>
        {patient.entries.map((entry) => (
          <PatientEntry key={entry.id} entry={entry} />
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openNewEntryForm()}
      >
        Add new Entry
      </Button>
    </div>
  );
};

export default PatientEntries;
