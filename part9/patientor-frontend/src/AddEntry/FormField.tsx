import { useState } from "react";
import {
  TextField as TextFieldMUI,
  Typography,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Input,
} from "@material-ui/core";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";

import { Diagnosis, HealthCheckRating } from "../types";

// ######################### TextField component #########################

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({ field, label, placeholder }: TextProps) => (
  <div style={{ marginBottom: "1em" }}>
    <TextFieldMUI
      fullWidth
      label={label}
      placeholder={placeholder}
      {...field}
    />
    <Typography variant="subtitle2" style={{ color: "red" }}>
      <ErrorMessage name={field.name} />
    </Typography>
  </div>
);

// ######################### SelectField component #########################

// strucutre of a single entry type option
export type TypeOption = {
  value: string;
  label: string;
};

// structure of a single health check option
export type HealthCheckOption = {
  value: HealthCheckRating;
  label: string;
};

// basis selection option types
type SelectOption = HealthCheckOption | TypeOption;

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: SelectOption[];
};

const FormikSelect = ({ field, ...props }: FieldProps) => (
  <Select {...field} {...props} />
);

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <>
    <InputLabel>{label}</InputLabel>
    <Field
      fullWidth
      style={{ marginBottom: "0.5em" }}
      label={label}
      component={FormikSelect}
      name={name}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label || option.value}
        </MenuItem>
      ))}
    </Field>
  </>
);

// ######################### Diagnose SelectField component #########################

interface DiagnoseProps {
  diagnoses: Diagnosis[];
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
}

export const DiagnosisSelectField = ({
  diagnoses,
  setFieldValue,
  setFieldTouched,
}: DiagnoseProps) => {
  const [selectedDiagnoses, setDiagnoses] = useState<string[]>([]);

  const field = "diagnosisCodes";
  const onChange = (data: string[]) => {
    setDiagnoses([...data]);
    setFieldTouched(field, true);
    setFieldValue(field, selectedDiagnoses);
  };

  const stateOptions = diagnoses.map((diagnosis) => ({
    key: diagnosis.code,
    text: `(${diagnosis.code}) ${diagnosis.name}`,
    value: diagnosis.code,
  }));

  return (
    <FormControl style={{ width: 552, marginBottom: "30px" }}>
      <InputLabel>Diagnoses</InputLabel>
      <Select
        multiple
        value={selectedDiagnoses}
        onChange={(e) => onChange(e.target.value as string[])}
        input={<Input />}
      >
        {stateOptions.map((option) => (
          <MenuItem key={option.key} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
      <ErrorMessage name={field} />
    </FormControl>
  );
};
