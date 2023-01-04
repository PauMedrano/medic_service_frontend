import * as React from 'react';
import { useState } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { TextField, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Form from 'react-bootstrap/Form';
import 'react-toastify/dist/ReactToastify.css';
import { validate, patient_map } from '../validators';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function PatientInfo({ has_search, data, done, set }) {

    const [dataState, setdataState] = useState({ ...data });
    const [found, setFound] = useState(false);
    const [isSearched, setSearched] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const dataHandler = (key, value) => {
        var aux = dataState;
        aux[key] = value;
        data[key] = value;
        if (key === 'type' && value !== 'Estudiante') {
            delete aux['career'];
            delete data['career'];
        }
        if (key === 'born_date') {
            var d = new Date(value.toString());
            var ageDifMs = Date.now() - d;
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            var result = Math.abs(ageDate.getUTCFullYear() - 1970);
            aux['age'] = result;
            data['age'] = result;
        }
        if (value.length === 0) {
            delete data[key];
        }
        setdataState({ ...data });
    }

    const createFormData = (dictionary) => {
        var formdata = new FormData();
        Object.keys(dictionary).forEach(key => {
            if (key !== "born_date") formdata.append(key, dictionary[key]);
        });
        return formdata;
    }

    function formatDate(date) {
        var d = new Date(date);
        return d.toJSON();
    }

    const process = () => {
        if (has_search === true) {
            if (found === false) {
                const sz = dataState['type'] === 'Estudiante' ? 8 : 7;
                if (Object.keys(dataState).length === sz && validate(dataState, patient_map) === true) {
                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", "Token " + authTokens['token']);
                    var formdata = createFormData(dataState);
                    console.log("Estoy aqui...");
                    console.log(formatDate(dataState['born_date'].toString()));
                    formdata.append("born_date", formatDate(dataState['born_date'].toString()));

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: formdata,
                        redirect: 'follow'
                    };

                    fetch("http://127.0.0.1:8000/patients/", requestOptions)
                        .then(response => {
                            if (response.status !== 200) {
                                toast.success('Sesion expirada');
                                logoutUser();
                            } else {
                                return response.json()
                            }
                        }
                        ).then(result => {
                            setdataState(result);
                            set(result)
                            toast.success('Se guardo el paciente exitosamente')
                        })
                        .catch(error => toast.error('Error al guardar paciente'));
                    done();

                } else {
                    toast.error('Datos erróneos');
                }
            } else {
                done();
            }
        } else {
            var sz = dataState['type'] === 'Estudiante' ? 8 : 7;
            if (Object.keys(dataState).length > 0 && dataState['id'] != undefined) sz += 1;
            if (Object.keys(dataState).length > 0 && dataState['medical_records'] != undefined) sz += 1;
            if (Object.keys(dataState).length > 0 && dataState['medical_consultation'] != undefined) sz += 1;
            console.log(dataState)
            console.log(Object.keys(dataState).length, sz);
            if (Object.keys(dataState).length === sz && validate(dataState, patient_map) === true) {
                const aux = dataState;
                delete aux['medical_records'];
                delete aux['medical_consultation'];
                var formdata = createFormData(aux);
                //formdata.append('participant_id', "http://localhost:8000/patients/" + dataState['id'] + "/");
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Token " + authTokens['token']);
                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch("http://localhost:8000/patients/" + dataState['id'] + "/", requestOptions)
                    .then(response => {
                        if (response.status !== 200) {
                            toast.success('Sesion expirada');
                            logoutUser();
                        } else {
                            return response.text()
                        }
                    })
                    .then(result => {
                        toast.success('Se edito el paciente exitosamente');
                    })
                    .catch(error => toast.error('Error al guardar paciente'));
            } else {
                toast.error('Datos erróneos');
            }
        }

    }

    const search = () => {
        setdataState({});
        set({})
        if (searchValue !== '' && (searchValue.length === 10 || searchValue.length === 7)) {
            setSearched(true);
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Token " + authTokens['token']);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };
            const url = 'http://127.0.0.1:8000/patients/?id_num=' + searchValue;
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
                    if (data.length > 0) {
                        setdataState(data[0]);
                        set(data[0])
                        setFound(true);
                    } else {
                        setFound(false);
                        setdataState({ id_num: searchValue });
                        set({ id_num: searchValue })
                    }
                })
                .catch((err) => {
                    setdataState({});
                    toast.error('Error de conexion');
                });
        } else {
            toast.error('Valor invalido');
        }
    }
    return (
        <>
            {has_search === true &&
                <div className='oval_div'>
                    <Form.Control
                        required
                        onChange={
                            event => setSearchValue(event.target.value)
                        }
                        style={
                            {
                                width: '50%',
                                'vertical-align': 'middle',
                                marginLeft: '1em',
                                marginRight: '1em'
                            }
                        }
                        placeholder="Ingresa el numero de identificacion"
                    />
                    <Button variant="primary" onClick={() => search()}>
                        Buscar
                    </Button>
                </div>
            }

            {(Object.keys(dataState).length >= 1 && isSearched === true) &&
                <>
                    <Container>
                        {has_search === true &&
                            <>
                                {found === false ?
                                    <>
                                        <h4>Paciente no encontrado</h4>
                                        <h7>Llenar datos del paciente</h7>
                                    </>
                                    :
                                    <h4>Paciente encontrado</h4>
                                }
                            </>
                        }
                    </Container>
                </>
            }

            {Object.keys(data).length >= 1 &&
                <div className='oval_div_patient'>
                    <Container style={{ width: '100%' }}>
                        <Row style={{
                            'text-align': 'center', 'justify-content': 'center',
                            'align-items': 'center', marginTop: '1em'
                        }}>
                            <Col sm={3}>
                                <TextField
                                    readonly
                                    required
                                    id="filled-textarea1"
                                    label="Num. Identificacion:"
                                    placeholder=""
                                    value={data['id_num'] || ''}
                                    variant="filled"
                                />
                            </Col>
                            <Col sm={3}>
                                <TextField
                                    required
                                    onChange={event => dataHandler('name', event.target.value)}
                                    id="filled-textarea2"
                                    label="Nombre:"
                                    placeholder=""
                                    value={Object.keys(data).length === 1 ? data['name'] : data['name'] || ''}
                                    variant="filled"
                                />
                            </Col>
                            <Col sm={3}>
                                <TextField
                                    required
                                    onChange={event => dataHandler('last_name', event.target.value)}
                                    id="filled-textarea"
                                    label="Apellido:"
                                    placeholder=""
                                    value={Object.keys(data).length === 1 ? data['last_name'] : data['last_name'] || ''}
                                    variant="filled"
                                />
                            </Col>
                        </Row>
                        <Row style={{
                            'text-align': 'center', 'justify-content': 'center',
                            'align-items': 'center', marginTop: '1em'
                        }}>
                            <Col sm={2}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Fecha de nacimiento"
                                        value={data['born_date']}
                                        onChange={(value) => dataHandler('born_date', value)}
                                        renderInput={
                                            (params) =>
                                                <TextField
                                                    variant="filled"
                                                    {...params}
                                                />}
                                    />
                                </LocalizationProvider>
                            </Col>
                            <Col sm={1}>
                                <TextField
                                    required
                                    onChange={event => dataHandler('age', event.target.value)}
                                    id="filled-textarea"
                                    label="Edad:"
                                    placeholder=""
                                    value={data['age'] || ''}
                                    variant="filled"
                                />
                            </Col>
                            <Col sm={2}>
                                <FormControl fullWidth>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native" required style={{ paddingLeft: '1em', paddingTop: '.5em' }}>
                                        Type:
                                    </InputLabel>
                                    <Select style={{ width: '100%' }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={Object.keys(data).length === 1 ? data['type'] : data['type'] || ''}
                                        label="Type:"
                                        variant="filled"
                                        onChange={event => dataHandler('type', event.target.value)}
                                    >
                                        <MenuItem value={'Estudiante'}>Estudiante</MenuItem>
                                        <MenuItem value={'Profesor'}>Profesor</MenuItem>
                                        <MenuItem value={'Trabajador'}>Trabajador</MenuItem>
                                        <MenuItem value={'PAEE'}>PAEE</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col sm={2}>
                                <FormControl fullWidth>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native" required style={{ paddingLeft: '1em', paddingTop: '.5em' }}>
                                        Sexo:
                                    </InputLabel>
                                    <Select style={{ width: '100%' }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={Object.keys(data).length === 1 ? data['gender'] : data['gender'] || ''}
                                        label="Sexo"
                                        variant="filled"
                                        onChange={event => dataHandler('gender', event.target.value)}
                                    >
                                        <MenuItem value={'Femenino'}>Femenino</MenuItem>
                                        <MenuItem value={'Masculino'}>Masculino</MenuItem>
                                    </Select>
                                </FormControl>

                            </Col>
                            {data['type'] === "Estudiante" && <Col sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel variant="standard" htmlFor="uncontrolled-native" required style={{ paddingLeft: '1em', paddingTop: '.5em' }}>
                                        Carrera:
                                    </InputLabel>
                                    <Select style={{ width: '100%' }}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={Object.keys(data).length === 1 ? data['career'] : data['career'] || ''}
                                        label="Carrera"
                                        variant="filled"
                                        onChange={event => dataHandler('career', event.target.value)}
                                    >
                                        <MenuItem value={'Ingeniería en Sistemas Computacionales'}>Ingeniería en Sistemas Computacionales</MenuItem>
                                        <MenuItem value={'Ingeniería Mecatrónica'}>Ingeniería Mecatrónica</MenuItem>
                                        <MenuItem value={'Ingeniería Metalúrgica'}>Ingeniería Metalúrgica</MenuItem>
                                        <MenuItem value={'Femenino'}>Ingeniería en Alimentos</MenuItem>
                                        <MenuItem value={'Ingeniería Ambiental'}>Ingeniería Ambiental</MenuItem>
                                    </Select>
                                </FormControl>

                            </Col>}
                        </Row>
                        <Row style={{ marginTop: '1em', 'align-items': 'center', 'justify-content': 'center', 'text-align': 'center' }}>
                            <Col>
                                <Button variant="success" onClick={() => { process() }}>
                                    {has_search === false ? <span>Editar</span> : <span>Continuar</span>}
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            }
        </>
    );
}