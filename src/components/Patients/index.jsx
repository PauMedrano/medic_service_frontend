
import DataTable from "../Table";
import { useState } from "react";
import { useEffect } from "react";
import Patient from '../Patient';
import { patients_columns } from '../headers'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

function Patients() {

  const [data, setData] = useState([]);
  const [allInfo, setallInfo] = useState(true);
  const [patient, setPatient] = useState({});
  const { authTokens, logoutUser } = useContext(AuthProvider);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authTokens['token']);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    const url = 'http://127.0.0.1:8000/patients/';
    fetch(url, requestOptions)
      .then((response) => {
        if (response.status !== 200) {
          logoutUser();
        } else {
          return response.json()
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const deletePatient = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authTokens['token']);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/patients/" + id + "/", requestOptions)
      .then(response => {
        if (response.status !== 200 && response.status !== 204) {
          toast.success('Sesion expirada');
          logoutUser();
        } else {
          var prev = [...data];
          prev.splice(prev.findIndex(e => e.id === id), 1);
          setData(prev);
          toast.success('Se elimino el paciente exitosamente');
        }
      }
      ).then(result => {
      })
      .catch(error => toast.error('Error al eliminar paciente'));
  }
  const handlePatientInfo = (data) => {
    window.open("http://localhost:3000/patient/" + data['id'], "_self");
  }

  return (
    <div style={{
      width: '70%',
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
      {allInfo === true ?
        <DataTable rows={data} columns={patients_columns} handleView={handlePatientInfo} name='Paciente' setallInfo={setallInfo} setPatient={setPatient} deleteFunc={deletePatient} />
        :
        <Patient patient={patient} setallInfo={setallInfo} />
      }
    </div>
  );
}

export default Patients;