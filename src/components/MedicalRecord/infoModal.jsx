import * as React from 'react';
import { useState } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './modal.css'
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

export default function InfoModal({ data }) {

    const [medicRecord, setMedicRecord] = useState(data);
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const medicRecordDataHandler = (key, value) => {
        console.log(medicRecord);
        var data = { ...medicRecord };
        data[key] = value
        setMedicRecord(data);
    }

    const createFormData = (dictionary) => {
        var formdata = new FormData();
        Object.keys(dictionary).forEach(key => {
            formdata.append(key, dictionary[key]);
        });
        return formdata;
    }

    const edit = () => {
        var formdata = createFormData(medicRecord);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_URL_BACK}/medical_records/${medicRecord['id']}/` , requestOptions)
            .then(response => {
                if (response.status !== 200) {
                    toast.success('Sesion expirada');
                    logoutUser();
                } else {
                    return response.text()
                }
            })
            .then(result => {
                toast.success('Se guardo la consulta medica exitosamente');
                window.open(`${process.env.REACT_APP_URL_FRONT}/medical-records/`, "_self");
            })
            .catch(error => toast.error('Error al guardar paciente'));
    }
    return (
        <div className='oval_div_modal' style={{ height: '350px' }}>
            <Container style={{ width: '80%' }}>
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
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['heart_rate'] : medicRecord['heart_rate'] || ''}
                            onChange={event => medicRecordDataHandler('heart_rate', event.target.value)}
                        />
                    </Col>

                    <Col sm>
                        <TextField
                            id="filled-textarea"
                            label="Frecuencia respiratoria:"
                            placeholder=""
                            variant="filled"
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['breathing_frequency'] : medicRecord['breathing_frequency'] || ''}
                            onChange={event => medicRecordDataHandler('breathing_frequency', event.target.value)}
                        />
                    </Col>
                    <Col sm>
                        <TextField
                            id="filled-textarea"
                            label="Temperatura:"
                            placeholder=""
                            variant="filled"
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['temperature'] : medicRecord['temperature'] || ''}
                            onChange={event => medicRecordDataHandler('temperature', event.target.value)}
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
                                    value={Object.keys(medicRecord).length === 1 ? medicRecord['blood_pressure_sis'] : medicRecord['blood_pressure_sis'] || ''}
                                    onChange={event => medicRecordDataHandler('blood_pressure_sis', event.target.value)}
                                />
                            </Col>
                            <Col style={{ marginLeft: '1px', paddingLeft: '0px' }}>
                                <TextField
                                    id="filled-textarea"
                                    label="DIA(mmHg)"
                                    placeholder=""
                                    variant="filled"
                                    value={Object.keys(medicRecord).length === 1 ? medicRecord['blood_pressure_dia'] : medicRecord['blood_pressure_dia'] || ''}
                                    onChange={event => medicRecordDataHandler('blood_pressure_dia', event.target.value)}
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
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['weight'] : medicRecord['weight'] || ''}
                            onChange={event => medicRecordDataHandler('weight', event.target.value)}
                        />
                    </Col>
                    <Col sm>
                        <TextField
                            id="filled-textarea"
                            label="Saturación de oxígeno:"
                            placeholder=""
                            variant="filled"
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['oxygen_saturation'] : medicRecord['oxygen_saturation'] || ''}
                            onChange={event => medicRecordDataHandler('oxygen_saturation', event.target.value)}
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
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['waist_hip_index'] : medicRecord['waist_hip_index'] || ''}
                            onChange={event => medicRecordDataHandler('waist_hip_index', event.target.value)}
                        />
                    </Col>
                    <Col sm>
                        <TextField
                            id="filled-textarea"
                            label="Indice de masa corporal:"
                            placeholder=""
                            variant="filled"
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['body_mass_index'] : medicRecord['body_mass_index'] || ''}
                            onChange={event => medicRecordDataHandler('body_mass_index', event.target.value)}
                        />
                    </Col>
                    <Col sm>
                        <TextField
                            id="filled-textarea"
                            label="Glucosa:"
                            placeholder=""
                            variant="filled"
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['glucose'] : medicRecord['glucose'] || ''}
                            onChange={event => medicRecordDataHandler('glucose', event.target.value)}
                        />
                    </Col>
                    <Col sm>
                        <TextField
                            id="filled-textarea"
                            label="Talla:"
                            placeholder=""
                            variant="filled"
                            value={Object.keys(medicRecord).length === 1 ? medicRecord['size'] : medicRecord['size'] || ''}
                            onChange={event => medicRecordDataHandler('size', event.target.value)}
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: '1em', 'align-items': 'center', 'justify-content': 'center', 'text-align': 'center' }}>
                    <Col>
                        <Button variant="success" onClick={() => { edit(); }}>Editar</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}