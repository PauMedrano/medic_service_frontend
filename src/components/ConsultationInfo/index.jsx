import * as React from 'react';
import Paper from '@mui/material/Paper';
import { useState } from "react";
import { useEffect } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { TextField, Autocomplete, MenuItem, Select, createFilterOptions } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Fab from '@mui/material/Fab';
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validate, consultation_map } from '../validators';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";


export default function ConsultationInfo({ title, data, id }) {

    const [dataState, setdataState] = useState({ ...data });
    const [selectData, setSelectData] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const defaultFilterOptions = createFilterOptions();

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
    }

    const dataHandler = (key, value) => {
        var data = { ...dataState };
        data[key] = value
        setdataState(data);
    }

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const url = 'http://127.0.0.1:8000/medical_supplys/';
        fetch(url, requestOptions)
            .then((response) => {
                if (response.status !== 200) {
                    toast.success('Sesion expirada');
                    logoutUser();
                } else {
                    return response.json()
                }
            })
            .then((data) => {
                setSelectData(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const createFormData = (dictionary) => {
        var formdata = new FormData();
        Object.keys(dictionary).forEach(key => {
            formdata.append(key, dictionary[key]);
        });
        return formdata;
    }

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, 5);
    };

    const process = () => {
        if (Object.keys(dataState).length >= 4 && validate(dataState, consultation_map) === true) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Token " + authTokens['token']);
            var formdata = createFormData(dataState);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
            var treatmentMessage = 'Se entrego'
            treatments.forEach(element => {
                formdata = new FormData();
                formdata.append('patient_id', 'http://127.0.0.1:8000/patients/' + id + '/');
                formdata.append('medical_supply_id', "http://localhost:8000/medical_supplys/" + element['id'] + "/");
                formdata.append('amount_delivered', element['quantity']);

                treatmentMessage += " " + element['quantity'] + " " + element['supply_unit'] + " de " + element['name'];

                requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch("http://127.0.0.1:8000/medication_deliverys/", requestOptions)
                    .then(response => {
                        if (response.status !== 200) {
                            toast.success('Sesion expirada');
                            logoutUser();
                        } else {
                            return response.text()
                        }
                    })
                    .then()
                    .catch(error => toast.error('Error al guardar paciente'));
            })
            formdata = createFormData(dataState);
            console.log(id)
            formdata.append('patient_id', id);
            formdata.append('treatment', treatmentMessage);
            formdata.append('date', new Date().toJSON())

            requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("http://127.0.0.1:8000/medical_consultations/", requestOptions)
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
                    window.open("http://localhost:3000/patient/" + id, "_self");
                })
                .catch(error => toast.error('Error al guardar paciente'));
        } else {
            toast.error('Valores incompletos');
        }
    }

    return (
        <>
            <Container>
                <h4>Consulta medica para: {title}</h4>
            </Container>
            <Row>
                <Col>
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
                                            value={Object.keys(dataState).length === 0 ? dataState['solicited_service'] : dataState['solicited_service'] || ''}
                                            label="Type:"
                                            variant="filled"
                                            onChange={event => dataHandler('solicited_service', event.target.value)}
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
                                        label="Padecimiento"
                                        multiline
                                        rows={4}
                                        variant="filled"
                                        required
                                        onChange={event => dataHandler('current_procedure', event.target.value)}
                                    />
                                </Col>

                                <Col sm>
                                    <TextField
                                        style={{
                                            width: '100%', marginTop: '1em'
                                        }}
                                        id="outlined-multiline-static"
                                        label="Exploracion física"
                                        multiline
                                        rows={4}
                                        variant="filled"
                                        required
                                        onChange={event => dataHandler('physical_exploration', event.target.value)}
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
                                        onChange={event => dataHandler('medical_diagnosis', event.target.value)}
                                    />
                                </Col>
                            </Row>

                            <Row style={{
                                'text-align': 'left', 'justify-content': 'center',
                                'align-items': 'center', marginTop: '1em'
                            }}>
                                <Paper sx={{ width: '70%', overflow: 'hidden', marginTop: '1rem', 'text-align': 'center', backgroundColor: '#bacfd4' }}>
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
                                                        options={selectData}
                                                        getOptionLabel={(option) => (option.name + " | " + option.lote ? option.name + " | " + option.lote : '')}
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
                                    <Button variant="success" onClick={() => { process() }}> Siguiente </Button>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Col>
            </Row>
        </>
    )
}