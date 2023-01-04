import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header'
import Patients from './components/Patients';
import Patient from './components/Patient';
import MedicalConsultation from './components/MedicalConsultation';
import NewConsultation from './components/NewConsultation';
import MedicalRecord from './components/MedicalRecord';
import Supplys from './components/Supplys';
import Login from './components/Login';
import PDFLink from './components/Reports';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <AuthProvider>
      <Header />
      <Switch>
          <PrivateRoute path='/' exact component={NewConsultation}/>
          <PrivateRoute path='/patients' exact component={Patients} />
          <PrivateRoute path='/patient/:id' exact component={Patient} />
          <PrivateRoute path='/medic-consultations' exact component={MedicalConsultation} />
          <PrivateRoute path='/medical-records' exact component={MedicalRecord}/>
          <PrivateRoute path='/report' exact component={PDFLink}/>
          <PrivateRoute path='/supplys' exact component={Supplys}/>
          <Route path='/login' exact component={Login}/>
      </Switch>
      </AuthProvider>
    </Router>
);

