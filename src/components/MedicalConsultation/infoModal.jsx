import * as React from 'react';
import { useState } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import Paper from '@mui/material/Paper';
import { TextField, Autocomplete, MenuItem, Select, createFilterOptions } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Fab from '@mui/material/Fab';
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './modal.css'
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

const defaultFilterOptions = createFilterOptions();

export default function ConsultationInfoModal({ data }) {

    const [medicConsultation, setMedicConsultation] = useState(data);
    const [treatmentsSelect, setTreatmentsSelect] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, 5);
    };

    const medicConsultationHandler = (key, value) => {
        var data = { ...medicConsultation };
        data[key] = value;
        setMedicConsultation(data);
        console.log(medicConsultation)
    }

    const createFormData = (dictionary) => {
        var formdata = new FormData();
        Object.keys(dictionary).forEach(key => {
            formdata.append(key, dictionary[key]);
        });
        return formdata;
    }

    const addTreatmentHandler = () => {
        var data = treatments;
        setTreatments([...data, { 'name': '' }]);
    }

    const treatmentHandler = (id, key, value) => {
        var data = [...treatments];
        if (key === 'name') {
            data[id] = value;
        } else {
            data[id]['quantity'] = value;
        }
        setTreatments(data);
        console.log(treatments);
    }

    const edit = () => {
        var formdata = createFormData(medicConsultation);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://localhost:8000/medical_consultations/" + medicConsultation['id'] + "/", requestOptions)
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
                window.open("http://localhost:3000/medic-consultations/", "_self");
            })
            .catch(error => toast.error('Error al guardar paciente'));
    }
    return (
        <div className='oval_div_consult_dinamic'>
            <Container style={{ width: '80%' }}>
                <Row style={{
                    'text-align': 'center', 'justify-content': 'center',
                    'align-items': 'center', marginTop: '2em'
                }}>
                    <Col sm>
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native" required style={{ paddingLeft: '1em', paddingTop: '.5em' }}>
                                Solicited service:
                            </InputLabel>
                            <Select style={{ width: '100%' }}
                                labelId="demo-simple-select-label"
                                id="select_service"
                                value={Object.keys(medicConsultation).length === 0 ? medicConsultation['solicited_service'] : medicConsultation['solicited_service'] || ''}
                                label="Type:"
                                variant="filled"
                                onChange={event => medicConsultationHandler('solicited_service', event.target.value)}
                            >
                                <MenuItem value={'Consulta'}>Consulta</MenuItem>
                                <MenuItem value={'Primeros auxilios'}>Primeros auxilios</MenuItem>
                            </Select>
                        </FormControl>
                    </Col>

                </Row>
                <Row style={{ marginTop: '1em' }}>
                    <Col sm>
                        <TextField
                            style={{
                                width: '100%', marginTop: '1em'
                            }}
                            id="outlined-multiline-static"
                            label="Procedimiento actual"
                            multiline
                            rows={4}
                            variant="filled"
                            required
                            value={Object.keys(medicConsultation).length === 0 ? medicConsultation['current_procedure'] : medicConsultation['current_procedure'] || ''}
                            onChange={event => medicConsultationHandler('current_procedure', event.target.value)}
                        />
                    </Col>

                    <Col sm>
                        <TextField
                            style={{
                                width: '100%', marginTop: '1em'
                            }}
                            id="outlined-multiline-static"
                            label="Explosión física"
                            multiline
                            rows={4}
                            variant="filled"
                            required
                            value={Object.keys(medicConsultation).length === 0 ? medicConsultation['physical_exploration'] : medicConsultation['physical_exploration'] || ''}
                            onChange={event => medicConsultationHandler('physical_exploration', event.target.value)}
                        />
                    </Col>

                </Row>
                <Row style={{ marginTop: '1em' }}>
                    <Col sm>
                        <TextField
                            style={{
                                width: '100%', marginTop: '1em'
                            }}
                            id="outlined-multiline-static"
                            label="Diagnostico medico"
                            multiline
                            rows={4}
                            variant="filled"
                            required
                            value={Object.keys(medicConsultation).length === 0 ? medicConsultation['medical_diagnosis'] : medicConsultation['medical_diagnosis'] || ''}
                            onChange={event => medicConsultationHandler('medical_diagnosis', event.target.value)}
                        />
                    </Col>
                </Row>

                <Row style={{
                    'text-align': 'left', 'justify-content': 'center',
                    'align-items': 'center', marginTop: '1em'
                }}>
                    <Paper sx={{ width: '60%', overflow: 'hidden', marginTop: '1rem', 'text-align': 'center', backgroundColor: '#bacfd4' }}>
                        <Row style={{ marginTop: '1em', marginBottom: '1em' }}>
                            <Col sm={9}>
                                <h5>Tratamientos para el paciente</h5>
                            </Col>
                            <Col >
                                <Fab size='small' color="success" aria-label="add" onClick={() => { addTreatmentHandler() }}>
                                    <AiOutlinePlus />
                                </Fab>
                            </Col>
                        </Row>
                        {treatments.map((element, index) => {
                            return (<>
                                <Row style={{
                                    'text-align': 'left', 'justify-content': 'center',
                                    'align-items': 'center', marginTop: '1em', marginLeft: '1em', marginRight: '1em', marginBottom: '1em'
                                }}>
                                    <Col sm={8}>
                                        <Autocomplete
                                            style={{ width: '100%' }}
                                            disablePortal
                                            filterOptions={filterOptions}
                                            id="combo-box-demo"
                                            options={treatmentsSelect}
                                            getOptionLabel={(option) => (option.name ? option.name : '')}
                                            sx={{ width: 300 }}
                                            onChange={(event, value) => { treatmentHandler(index, 'name', value) }}
                                            renderInput={(params) => <TextField value={element.name} variant="filled" {...params} label="Medicamento" />}
                                        />
                                    </Col>

                                    <Col sm >
                                        <TextField
                                            style={{ width: '100%' }}
                                            id={"filled-textarea" + index}
                                            label="Cantidad"
                                            variant="filled"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">
                                                    <span> / {element['amount'] || ''} </span></InputAdornment>
                                            }}

                                            onChange={event => treatmentHandler(index, 'amount', event.target.value)}
                                        />
                                    </Col>

                                </Row>
                            </>);
                        })}
                    </Paper>
                </Row>

                <Row style={{ marginTop: '1em', 'align-items': 'center', 'justify-content': 'center', 'text-align': 'center', marginBottom: '1em' }}>
                    <Col >
                        <Button variant="success" onClick={() => { edit() }}> Editar </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}