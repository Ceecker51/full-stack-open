import React from 'react';
import axios from 'axios';

import { apiBaseUrl } from './constants';
import { Patient } from './types';
import { setPatientList, useStateValue } from './state';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@material-ui/core';

import PatientListPage from './PatientListPage';
import PatientDetails from './PatientDetails';

const App = () => {

  // #################### State ####################

  const [, dispatch] = useStateValue();

  // #################### Data #################### 

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (error: unknown) {
        console.error('Somethin went wrong. Error: ');
        if (axios.isAxiosError(error) && error.response) {
          console.error(error.response.data.message);
        }
      }
    };

    void fetchPatientList();
  }, [dispatch]);

  // #################### Render ####################

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/patient/:id" element={<PatientDetails />} />
            <Route path="/" element={<PatientListPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
