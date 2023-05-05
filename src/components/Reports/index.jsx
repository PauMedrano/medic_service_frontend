
import * as React from 'react';
import { useState } from "react";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { TextField, FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import 'react-toastify/dist/ReactToastify.css';
import { reports_data } from './data';
import { toast } from 'react-toastify';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Report() {
    const [data, setData] = useState(reports_data);
    const [creation, setCreation] = useState({})
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const handler = (index, pos, value) => {
        const aux = [...data]
        aux[index].values[pos] = value;
        setData(aux);
    }

    const creationHandler = (key, value) => {
        const aux = { ...creation }
        aux[key] = value
        setCreation({ ...aux })
    }


    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const send = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);
        var formdata = new FormData();
        if (creation['date'] === undefined) {
            const actual_date = new Date();
            const result = formatDate(actual_date);
            formdata.append('date', result)
        } else {
            formdata.append('date', formatDate(creation['date'].toString()));
        }
        if(creation['from'] < creation['to']){
            
            formdata.append('from', creation['from'])
            formdata.append('to', creation['to'])
            formdata.append("data", JSON.stringify(data));

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
    
            fetch(`${process.env.REACT_APP_URL_BACK}/report/`, requestOptions)
                .then((response) => {
                    if (response.status !== 200) {
                        logoutUser();
                    } else {
                        return response.blob();
                    }
                })
                .then((blob) => {
                    const href = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'reporte.pdf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(error => toast.error('Error al crear el reporte'));
        }else{
            //show alert
        }
    }

    return (
        <>
            {
                data.map((value, index) => (
                    <div key = {index} className='oval_div_consult_dinamic' style={{ marginTop: '2em', width: '80%' }}>
                        <Container style={{ width: '100%' }}>
                            <h3>{value.title}</h3>
                            <Row style={{
                                'text-align': 'center', 'justify-content': 'center',
                                'align-items': 'center', marginTop: '1em', marginBottom: '1em'
                            }}>
                                {
                                    value.table_values.map((row) => (
                                        <Col id = {row.id} sm={row.name === 'Observaciones' || row.name === 'Fecha de elaboración' ? 5 : 2}>
                                            <h5>{row.name}</h5>
                                            {
                                                row.labels.map((textfild) => (
                                                    <TextField
                                                        required
                                                        style={{ width: '100%' }}
                                                        onChange={event => handler(index, textfild.index, event.target.value)}
                                                        key={textfild.index}
                                                        label={textfild.label}
                                                        value={value.values[textfild.index] || ''}
                                                        variant="filled"
                                                    />
                                                ))
                                            }
                                        </Col>
                                    ))
                                }
                            </Row>
                        </Container>
                    </div>
                ))
            }

            <div className='oval_div_consult_dinamic' style={{ marginTop: '2em', width: '80%' }}>
                <Container style={{ width: '60%' }}>
                    <Row style={{
                        'text-align': 'center', 'justify-content': 'center',
                        'align-items': 'center', marginTop: '1em', marginBottom: '1em'
                    }}>
                        <Col>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-controlled-open-select-label">Desde</InputLabel>
                                <Select
                                    variant="filled"
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    onChange={event => {creationHandler('from', event.target.value)}}
                                    label="Age"
                                >
                                    <MenuItem value={1}>Enero</MenuItem>
                                    <MenuItem value={2}>Febrero</MenuItem>
                                    <MenuItem value={3}>Marzo</MenuItem>
                                    <MenuItem value={4}>Abril</MenuItem>
                                    <MenuItem value={5}>Mayo</MenuItem>
                                    <MenuItem value={6}>Junio</MenuItem>
                                    <MenuItem value={7}>Julio</MenuItem>
                                    <MenuItem value={8}>Agosto</MenuItem>
                                    <MenuItem value={9}>Septiembre</MenuItem>
                                    <MenuItem value={10}>Octumbre</MenuItem>
                                    <MenuItem value={11}>Noviembre</MenuItem>
                                    <MenuItem value={12}>Diciembre</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                        <Col>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-controlled-open-select-label">Desde</InputLabel>
                                <Select
                                    variant="filled"
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    onChange={event => {creationHandler('to', event.target.value)}}
                                    label="Age"
                                >
                                    <MenuItem value={1}>Enero</MenuItem>
                                    <MenuItem value={2}>Febrero</MenuItem>
                                    <MenuItem value={3}>Marzo</MenuItem>
                                    <MenuItem value={4}>Abril</MenuItem>
                                    <MenuItem value={5}>Mayo</MenuItem>
                                    <MenuItem value={6}>Junio</MenuItem>
                                    <MenuItem value={7}>Julio</MenuItem>
                                    <MenuItem value={8}>Agosto</MenuItem>
                                    <MenuItem value={9}>Septiembre</MenuItem>
                                    <MenuItem value={10}>Octumbre</MenuItem>
                                    <MenuItem value={11}>Noviembre</MenuItem>
                                    <MenuItem value={12}>Diciembre</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>
                        < Col sm={5}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de elaboracion"
                                    value={creation['date']}
                                    onChange={(value) => creationHandler('date', value)}
                                    renderInput={
                                        (params) =>
                                            <TextField
                                                variant="filled"
                                                {...params}
                                            />}
                                />
                            </LocalizationProvider>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Row style={{ marginTop: '1em', paddingBottom: '10px', 'align-items': 'center', 'justify-content': 'center', 'text-align': 'center' }}>
                <Col >
                    <Button variant="success" onClick={() => { send() }} style={{ marginLeft: '1em' }}>
                        Crear reporte
                    </Button>
                </Col>
            </Row>
        </>
    );
}