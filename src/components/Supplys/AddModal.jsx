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

export default function AddModal() {

    const [supply, setSupply] = useState({ name: '' });
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
            .then((response) => {
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
        console.log(value.toString());
        var data = { ...supply };
        data[key] = value
        setSupply(data);
        console.log(data);
    }
    const supplyHandler2 = (value) => {
        var data = { ...supply };
        data['name'] = typeof value === "string" ? value : value['name'];
        data['supply_unit'] = typeof value === "string" ? value : value['supply_unit'];
        if (data['name'] === "Otro") {
            data['name'] = '';
            setIsOther(true);
        }
        setSupply(data);
        console.log(data);
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
        if (string_validator(supply['name']) === true && num_validator(supply['amount']) === true && string_validator(supply['supply_unit']) === true && string_validator(supply['lote']) === true) {
            console.log(treatmentsSelect.findIndex(e => e.lote === supply['lote']));
            if (treatmentsSelect.findIndex(e => e.lote === supply['lote']) == -1) {
                formdata.append("name", supply['name']);
                formdata.append("amount", supply['amount']);
                formdata.append("lote", supply['lote']);
                formdata.append("supply_unit", supply['supply_unit']);
                formdata.append("expiration_date", formatDate(supply['expiration_date'].toString()));

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow'
                };

                fetch(`${process.env.REACT_APP_URL_BACK}/medical_supplys/`, requestOptions)
                    .then(response => {
                        if (response.status !== 200 && response.status !== 201) {
                            console.log("Test", response.status)
                            logoutUser();
                        } else {
                            return response.json();
                        }
                    }
                    ).then(result => {
                        toast.success('Se guardo el paciente exitosamente');
                        window.open(`${process.env.REACT_APP_URL_FRONT}/supplys/`, "_self");
                        setSupply({})
                    })
                    .catch(error => toast.error('Error al guardar paciente'));
            } else {
                toast.error('Lote ya existente');
            }
        } else {
            toast.error('Datos erróneos');
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
                        {isOther === false ?
                            <Autocomplete
                                style={{ width: '100%' }}
                                disablePortal
                                filterOptions={filterOptions}
                                id="combo-box-demo"
                                options={treatmentsSelect}
                                getOptionLabel={(option) => (option.name ? option.name : '')}
                                sx={{ width: 300 }}
                                onChange={(event, value) => {
                                    supplyHandler2(value);
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        onChange={event => supplyHandler('name', event.target.value)}
                                        value={Object.keys(supply).length === 0 ? supply['name'] : supply['name'] || ''}
                                        variant="filled"
                                        {...params}
                                        label="Nombre" />
                                }
                            /> :
                            <TextField
                                required
                                onChange={event => supplyHandler('name', event.target.value)}
                                id="filled-textarea218"
                                label="Nombre:"
                                placeholder=""
                                value={Object.keys(supply).length === 0 ? supply['name'] : supply['name'] || ''}
                                variant="filled"
                            />
                        }

                    </Col>
                    <Col sm={3}>
                        <TextField
                            required
                            onChange={event => supplyHandler('amount', event.target.value)}
                            id="filled-textarea2"
                            label="Cantidad:"
                            placeholder=""
                            value={Object.keys(supply).length === 0 ? supply['amount'] : supply['amount'] || ''}
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
                            value={Object.keys(supply).length === 0 ? supply['supply_unit'] : supply['supply_unit'] || ''}
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
                            value={Object.keys(supply).length === 0 ? supply['lote'] : supply['lote'] || ''}
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
                                value={supply['expiration_date']}
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
                        <Button variant="success" onClick={() => { save(); }}>
                            Guardar y añadir mas
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}