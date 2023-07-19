import {
  DateRange,
  Diagnosis,
  EntryWithoutId,
  Gender,
  HealthCheckRating,
  NewPatient,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number' || num instanceof Number;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const isRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseString = (label: string, text: unknown): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing ${label}:  ${text}`);
  }

  return text;
};

const parseNumber = (label: string, num: unknown): number => {
  if (!num || !isNumber(num)) {
    throw new Error('Incorrect or missing ' + label);
  }

  return num;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(
      'Incorrect or missing gender: ' +
        gender +
        '. Expected values are ' +
        Object.values(Gender).join(' | ')
    );
  }

  return gender;
};

const parseRating = (rating: unknown): HealthCheckRating => {
  const ratingNumber = parseNumber('rating', rating);

  if (isNaN(ratingNumber) || !isRating(ratingNumber)) {
    throw new Error(
      'Incorrect or missing rating. Expected values: ' +
        Object.values(HealthCheckRating).join(' | ')
    );
  }

  return ratingNumber;
};

const parseDiagnosticCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCode' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCode as Array<Diagnosis['code']>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSickLeave = (sickLeave: any): DateRange | undefined => {
  if (!sickLeave) {
    return undefined;
  }

  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = (object: any): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString('name', object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseString('ssn', object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString('occupation', object.occupation),
    entries: [],
  };

  return newPatient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toEntryWithoutId = (object: any): EntryWithoutId => {
  const type = parseString('type', object.type);

  switch (type) {
    case 'HealthCheck':
      return {
        description: parseString('description', object.description),
        date: parseDate(object.date),
        specialist: parseString('specialist', object.specialist),
        diagnosisCodes: parseDiagnosticCodes(object.diagnosisCodes),

        type: type,
        healthCheckRating: parseRating(object.healthCheckRating),
      };

    case 'Hospital':
      return {
        description: parseString('description', object.description),
        date: parseDate(object.date),
        specialist: parseString('specialist', object.specialist),
        diagnosisCodes: parseDiagnosticCodes(object.diagnosisCodes),

        type: type,
        discharge: {
          date: parseDate(object.discharge.date),
          criteria: parseString('criteria', object.discharge.criteria),
        },
      };

    case 'OccupationalHealthcare':
      return {
        description: parseString('description', object.description),
        date: parseDate(object.date),
        specialist: parseString('specialist', object.specialist),
        diagnosisCodes: parseDiagnosticCodes(object.diagnosisCodes),

        type: type,
        employerName: parseString('employerName', object.employerName),
        sickLeave: parseSickLeave(object.sickLeave),
      };

    default:
      throw new Error('Unknown entry type');
  }
};
