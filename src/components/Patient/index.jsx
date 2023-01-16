
import DataTable from "../Table";
import { Row, Col } from 'react-bootstrap';
import { useState } from "react";
import { useEffect } from "react";
import './index.css';
import { medical_consultation_columns, medical_record_columns } from '../headers'
import { useParams } from 'react-router';
import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import PatientInfo from '../PatientInfo';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";
import InfoModal from "../MedicalConsultation/infoModal";
import InfoRecordModal from "../MedicalRecord/infoModal";


function Patient({ setallInfo }) {
    const [disabled, setDisabled] = useState(true);
    const [medicConsultation, setMedicConsultation] = useState([]);
    const [oneMedicConsultation, setOneMedicConsultation] = useState([]);
    const [medicRecord, setMedicRecord] = useState([]);
    const [oneMedicRecord, setOneMedicRecord] = useState([]);
    const [patient, setPatient] = useState({});
    const { id } = useParams();
    const { authTokens, logoutUser } = useContext(AuthProvider);

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const url = "http://127.0.0.1:8000/patients/?id=" + id;
        fetch(url, requestOptions)
            .then((response) => {
                if (response.status !== 200 ) {
                    toast.success('Sesion expirada');
                    logoutUser();
                } else {
                    return response.json()
                }
            })
            .then((data) => {
                console.log(data);
                if (data.length > 0) {
                    setPatient(data[0]);
                    setMedicConsultation(data[0]['medical_consultation'])
                    setMedicRecord(data[0]['medical_records'])
                }
            })
            .catch((err) => {
                console.log('invalido xd')
                console.log(err.message);
            });
    }, []);

    const deleteMedicalConsultation = (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:8000/medical_consultations/" + id + "/", requestOptions)
            .then(response => {
                if (response.status !== 200 && response.status !== 204) {
                    toast.success('Sesion expirada');
                    logoutUser();
                } else {
                    var prev = [...medicConsultation];
                    prev.splice(prev.findIndex(e => e.id === id), 1);
                    setMedicConsultation(prev);
                    toast.success('Se elimino la consulta medica exitosamente');
                }

            }
            ).then(result => {
            })
            .catch(error => toast.error('Error al eliminar la consulta medica'));
    }

    const deleteMedicalRecord = (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Token " + authTokens['token']);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:8000/medical_records/" + id + "/", requestOptions)
            .then(response => {
                if (response.status !== 200 && response.status !== 204) {
                    toast.success('Sesion expirada');
                    logoutUser();
                } else {
                    var prev = [...medicRecord];
                    prev.splice(prev.findIndex(e => e.id === id), 1);
                    setMedicRecord(prev);
                    toast.success('Se elimino la consulta medica exitosamente');
                }
            }
            ).then(result => {
            })
            .catch(error => toast.error('Error al eliminar la consulta medica'));
    }
    return (
        <div style={{
            minWidth: '1024px',
            margin: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
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

            <Row style={{
                'text-align': 'left',
                marginTop: '1em'
            }}>
                <Col>
                    <div style={{
                        width: '70%',
                        minWidth: '1024px',
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',

                    }}>
                        <PatientInfo
                            has_search={false}
                            data={patient}
                            set={setPatient}
                        />
                    </div>
                    <DataTable
                        rows={medicRecord}
                        columns={medical_record_columns}
                        name='Expedientes medicos'
                        handleView={null}
                        setInfo={setOneMedicRecord}
                        deleteFunc={deleteMedicalRecord}
                        modalContainer={<InfoRecordModal data={oneMedicRecord} />}
                    />
                    <DataTable
                        rows={medicConsultation}
                        columns={medical_consultation_columns}
                        name='Consultas medicas'
                        deleteFunc={deleteMedicalConsultation}
                        handleView={null}
                        setInfo={setOneMedicConsultation}
                        modalContainer={<InfoModal data={oneMedicConsultation} />}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Patient;