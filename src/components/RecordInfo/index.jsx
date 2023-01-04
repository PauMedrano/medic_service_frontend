import * as React from 'react';
import { useState } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import 'react-toastify/dist/ReactToastify.css';
import { validate, record_map } from '../validators';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

export default function RecordInfo({ title, id, data, done }) {

    const [dataState, setdataState] = useState({ ...data });
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const dataHandler = (key, value) => {
        var data = dataState;
        data[key] = value
        if (value.length === 0) {
            delete data[key];
        }
        setdataState(data);
    }

    const createFormData = (dictionary) => {
        var formdata = new FormData();
        Object.keys(dictionary).forEach(key => {
            formdata.append(key, dictionary[key]);
        });
        return formdata;
    }

    const process = () => {
        if (Object.keys(dataState).length === 11) {
            if (validate(dataState, record_map) === true) {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Token " + authTokens['token']);
                var formdata = createFormData(dataState);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };
                formdata = createFormData(dataState);
                formdata.append('patient_id', 'http://127.0.0.1:8000/patients/' + id + '/');

                requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch("http://127.0.0.1:8000/medical_records/", requestOptions)
                    .then(response => {
                        if (response.status !== 200) {
                            logoutUser();
                        } else {
                            return response.text()
                        }
                    })
                    .then(result => {
                        done()
                        toast.success('Se guardo el recod medico exitosamente');
                    }).catch(error => toast.error('Error al guardar paciente'));
            }

        } else if (Object.keys(dataState).length === 0) {
            toast.info('Recuerda llenar el record medico despues');
            done()
        } else if (Object.keys(dataState).length >= 1 && Object.keys(dataState).length < 11) {
            toast.error('Valores incompletos');
        }

    }

    return (
        <>
            <Container>
                <h4>Expediente medico de: {title} </h4>
            </Container>
            <Row>
                <Col>
                    <div className='oval_div_info' style={{ height: '350px', width: '85%' }}>
                        <Container style={{ width: '90%' }}>
                            <Row style={{
                                'text-align': 'center', 'justify-content': 'center',
                                'align-items': 'center', marginTop: '1em'
                            }}>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Ritmo cardiaco:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('heart_rate', event.target.value)}
                                    />
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Frecuencia respiratoria:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('breathing_frequency', event.target.value)}
                                    />
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Temperatura:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('temperature', event.target.value)}
                                    />
                                </Col>

                            </Row>
                            <Row style={{ marginTop: '1em' }}>
                                <Col sm={4}>
                                    <Row>
                                        <Col style={{ marginRight: '0px', paddingRight: '0px' }}>
                                            <TextField
                                                id="filled-textarea"
                                                label="SIS(mmHg):"
                                                placeholder=""
                                                variant="filled"
                                                onChange={event => dataHandler('blood_pressure_sis', event.target.value)}
                                            />
                                        </Col>
                                        <Col style={{ marginLeft: '1px', paddingLeft: '0px' }}>
                                            <TextField
                                                id="filled-textarea"
                                                label="DIA(mmHg)"
                                                placeholder=""
                                                variant="filled"
                                                onChange={event => dataHandler('blood_pressure_dia', event.target.value)}
                                            />
                                        </Col>

                                    </Row>
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Peso:"
                                        placeholder=""
                                        variant="filled"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>
                                        }}
                                        onChange={event => dataHandler('weight', event.target.value)}
                                    />
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Talla:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('size', event.target.value)}
                                    />
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Saturación de oxígeno:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('oxygen_saturation', event.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '1em' }}>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Indice cintura cadera:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('waist_hip_index', event.target.value)}
                                    />
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Indice de masa corporal:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('body_mass_index', event.target.value)}
                                    />
                                </Col>
                                <Col sm>
                                    <TextField
                                        id="filled-textarea"
                                        label="Glucosa:"
                                        placeholder=""
                                        variant="filled"
                                        onChange={event => dataHandler('glucose', event.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '1em', 'align-items': 'center', 'justify-content': 'center', 'text-align': 'center' }}>
                                <Col>
                                    <Button variant="success" onClick={() => { process() }}>Siguiente</Button>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Col>
            </Row>
        </>
    );
}