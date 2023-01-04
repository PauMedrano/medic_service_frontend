import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import RecordInfo from '../RecordInfo';
import PatientInfo from '../PatientInfo';
import ConsultationInfo from '../ConsultationInfo';

const steps = [
    'Buscar paciente',
    'Llenar expediente medico',
    'Llenar consulta medica',
];

export default function NewConsultation() {

    const [patient, setPatient] = useState({});
    const [step, setStep] = useState(0);

    const done = () => {
        setStep(step + 1);
    }

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Box sx={{ width: '100%', paddingTop: '1em' }}>
                <Stepper activeStep={step} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <div style={{
                width: '70%',
                minWidth: '1024px',
                margin: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                paddingTop: '1em'
            }}>
                {(() => {
                    if (step === 0) {
                        return (
                            <PatientInfo
                                done = {done}
                                set = {setPatient}
                                has_search = {true}
                                data = {patient}

                            />
                        )
                    } else if (step === 1) {
                        return (
                            <RecordInfo 
                                title = {patient.name}
                                done = {done}
                                id = {patient.id}
                            />
                        )
                    } else if (step === 2) {
                        return (
                            <ConsultationInfo
                                title = {patient.name}
                                done = {done}
                                id = {patient.id}
                            />
                        )
                    }
                })()}
            </div>
        </>
    );
}
