import { Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { TextField, Autocomplete, createFilterOptions } from '@mui/material';
import { string_validator, num_validator } from '../validators';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

export default function SupplyInfoModal({ data }) {

    const [supply, setSupply] = useState({ ...data });
    const [treatmentsSelect, setTreatmentsSelect] = useState([]);
    const [isOther, setIsOther] = useState(false);
    const [value, setValue] = useState(null);
    const { authTokens, logoutUser } = useContext(AuthProvider);

    const defaultFilterOptions = createFilterOptions();

    const filterOptions = (options, state) => {
        var list = defaultFilterOptions(options, state).slice(0, 5);
        list = [...list, { 'name': 'Otro' }]
        return list;
    };
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const url = `${process.env.REACT_APP_URL_BACK}/medical_supplys/`;
        fetch(url, requestOptions)
            .then((response, requestOptions) => {
                if (response.status !== 200) {
                    logoutUser();
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setTreatmentsSelect(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const supplyHandler = (key, value) => {
        var aux = { ...supply };
        aux[key] = value;
        data[key] = value;
        setSupply(aux);
    }
    const supplyHandler2 = (value) => {
        var aux = { ...supply };
        aux['name'] = typeof value === "string" ? value : value['name'];
        aux['supply_unit'] = typeof value === "string" ? value : value['supply_unit'];
        if (aux['name'] === "Otro") {
            aux['name'] = '';
            setIsOther(true);
        }
        data = aux;
        setSupply(data);
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

    const save = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);
        var formdata = new FormData();
        console.log(supply);
        if (string_validator(supply['name']) === true && num_validator(supply['amount']) === true && string_validator(supply['supply_unit']) === true) {
            formdata.append("name", supply['name']);
            formdata.append("amount", supply['amount']);
            formdata.append("lote", supply['lote']);
            formdata.append("supply_unit", supply['supply_unit']);
            formdata.append("expiration_date", formatDate(supply['expiration_date'].toString()));

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch(`${process.env.REACT_APP_URL_BACK}/medical_supplys/${supply['id']}/`, requestOptions)
                .then(response => {
                    if (response.status !== 200 && response.status !== 304 && response.status !== 204) {
                        console.log(response.status)
                        logoutUser();
                    } else {
                        return response.json();
                    }
                }
                ).then(result => {
                    toast.success('Se guardo el paciente exitosamente');
                    window.open(`${process.env.REACT_APP_URL_FRONT}/supplys/`, "_self");
                })
                .catch(error => toast.error('Error al guardar paciente'));
        }
    }

    return (
        <div className='oval_div_patient' style={{ width: '80%', height: '350px' }}>
            <Container style={{ width: '100%' }}>
                <Row style={{
                    'text-align': 'center', 'justify-content': 'center',
                    'align-items': 'center', marginTop: '1em'
                }}>
                    <Col sm={3}>
                        <TextField
                            required
                            onChange={event => supplyHandler('name', event.target.value)}
                            id="filled-textarea218"
                            label="Nombre:"
                            placeholder=""
                            value={Object.keys(data).length === 0 ? data['name'] : data['name'] || ''}
                            variant="filled"
                        />
                    </Col>
                    <Col sm={3}>
                        <TextField
                            required
                            onChange={event => supplyHandler('amount', event.target.value)}
                            id="filled-textarea2"
                            label="Cantidad:"
                            placeholder=""
                            value={Object.keys(data).length === 0 ? data['amount'] : data['amount'] || ''}
                            variant="filled"
                        />
                    </Col>
                </Row>
                <Row style={{
                    'text-align': 'center', 'justify-content': 'center',
                    'align-items': 'center', marginTop: '1em'
                }}>
                    <Col sm={3}>
                        <TextField
                            required
                            onChange={event => supplyHandler('supply_unit', event.target.value)}
                            id="filled-textarea2"
                            label="Unidad:"
                            placeholder=""
                            value={Object.keys(data).length === 0 ? data['supply_unit'] : data['supply_unit'] || ''}
                            variant="filled"
                        />
                    </Col>
                    <Col sm={3}>
                        <TextField
                            required
                            onChange={event => supplyHandler('lote', event.target.value)}
                            id="filled-textarea"
                            label="Lote:"
                            placeholder=""
                            value={Object.keys(data).length === 0 ? data['lote'] : data['lote'] || ''}
                            variant="filled"
                        />
                    </Col>
                </Row>

                <Row style={{
                    'text-align': 'center', 'justify-content': 'center',
                    'align-items': 'center', marginTop: '1em'
                }}>
                    <Col >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de caducidad"
                                value={data['expiration_date']}
                                onChange={(value) => supplyHandler('expiration_date', value)}
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

                <Row style={{ marginTop: '1em', 'align-items': 'center', 'justify-content': 'center', 'text-align': 'center' }}>
                    <Col >

                        <Button variant="success" onClick={() => { save(); }} style={{ marginLeft: '1em' }}>
                            Editar
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}