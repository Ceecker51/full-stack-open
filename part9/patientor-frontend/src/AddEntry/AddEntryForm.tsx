import { Field, Formik, Form } from "formik";
import { Grid, Button } from "@material-ui/core";

import {
  TextField,
  SelectField,
  DiagnosisSelectField,
  HealthCheckOption,
  TypeOption,
} from "./FormField";

import { Diagnosis, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

// #################### Form Types ####################

export type EntryFormValues = {
  type: string;

  // Basic Entry
  description: string;
  date: string;
  specialist: string;
  diagnosticCodes: Array<Diagnosis["code"]>;

  // HealthCheck
  healthCheckRating: HealthCheckRating;

  // Hospital
  dischargeDate: string;
  dischargeCriteria: string;

  // OccupationalHealthcare
  employerName: string;
  sickLeaveStartDate: string;
  sickLeaveEndDate: string;
};

// #################### Formik ####################

const initialValues = {
  type: "HealthCheck",

  description: "",
  date: "",
  specialist: "",
  diagnosticCodes: [""],

  healthCheckRating: HealthCheckRating.Healthy,

  dischargeDate: "",
  dischargeCriteria: "",

  employerName: "",
  sickLeaveStartDate: "",
  sickLeaveEndDate: "",
};

const validate = (values: EntryFormValues) => {
  const requiredError = "Field is required";
  const errors: { [field: string]: string } = {};

  if (!values.type) {
    errors.type = requiredError;
  }

  if (!values.description) {
    errors.description = requiredError;
  }

  if (!values.date) {
    errors.date = requiredError;
  }

  if (!values.specialist) {
    errors.specialist = requiredError;
  }

  if (values.type === "HealthCheck") {
    if (values.healthCheckRating < 0 && values.healthCheckRating > 4) {
      errors.healthCheckRating = requiredError;
    }
  } else if (values.type === "Hospital") {
    if (!values.dischargeDate) {
      errors.dischargeDate = requiredError;
    }

    if (!values.dischargeCriteria) {
      errors.dischargeCriteria = requiredError;
    }
  } else if (values.type === "OccupationalHealthcare") {
    if (!values.employerName) {
      errors.employerName = requiredError;
    }

    if (!values.sickLeaveStartDate) {
      errors.sickLeaveStartDate = requiredError;
    }

    if (!values.sickLeaveEndDate) {
      errors.sickLeaveEndDate = requiredError;
    }
  }

  return errors;
};

// #################### Form ####################

const typeOptions: TypeOption[] = [
  { value: "HealthCheck", label: "Health Check" },
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
];

const healthCheckRatingOptions: HealthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: "(0) Health" },
  { value: HealthCheckRating.LowRisk, label: "(1) Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "(2) High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "(3) Critical Risk" },
];

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnosis }] = useStateValue();

  const getTypeLabel = (type: string) => {
    const option = typeOptions.find((value) => value.value === type);
    return option?.label;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({ values, isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <SelectField label="Type" name="type" options={typeOptions} />
            <h3>New {getTypeLabel(values.type)} entry</h3>
            <Field
              label="Description"
              placeholder="Entry Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelectField
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnosis)}
            />

            {values.type === "HealthCheck" && (
              <SelectField
                label="Healthcheck rating"
                name="healthCheckRating"
                options={healthCheckRatingOptions}
              />
            )}

            {values.type === "Hospital" && (
              <>
                <Field
                  label="Discharge Date"
                  placeholder="YYYY-MM-DD"
                  name="dischargeDate"
                  component={TextField}
                />
                <Field
                  label="Discharge Criteria"
                  placeholder="Criteria"
                  name="dischargeCriteria"
                  component={TextField}
                />
              </>
            )}

            {values.type === "OccupationalHealthcare" && (
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Start of Sick Leave"
                  placeholder="YYYY-MM-DD"
                  name="sickLeaveStartDate"
                  component={TextField}
                />
                <Field
                  label="End of Sick Leave"
                  placeholder="YYYY-MM-DD"
                  name="sickLeaveEndDate"
                  component={TextField}
                />
              </>
            )}

            <Grid container direction="row" justifyContent="space-between">
              <Grid item>
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};
