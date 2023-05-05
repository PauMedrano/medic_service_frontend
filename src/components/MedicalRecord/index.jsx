
import DataTable from "../Table";
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { medical_record_columns_with_patient } from '../headers'
import InfoModal from "./infoModal";
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

function MedicalRecord() {

  const [data, setData] = useState([]);
  const [record, setRecord] = useState({});
  const { authTokens, logoutUser } = useContext(AuthProvider);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authTokens['token']);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    const url = `${process.env.REACT_APP_URL_BACK}/medical_records/`;
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
        console.log(data);
        setData(data);
      })
      .catch((err) => {
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

    fetch(`${process.env.REACT_APP_URL_BACK}/medical_records/${id}/`, requestOptions)
      .then(response => {
        if (response.status !== 200 && response.status !== 204) {
          toast.success('Sesion expirada');
          logoutUser();
        } else {
          var prev = [...data];
          prev.splice(prev.findIndex(e => e.id === id), 1);
          setData(prev);
          toast.success('Se elimino la consulta medica exitosamente');
        }
      }
      ).then(result => {
      })
      .catch(error => toast.error('Error al eliminar la consulta medica'));
  }

  return (
    <>
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

      <div style={{
        minWidth: '1024px',
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>

        <DataTable
          rows={data}
          columns={medical_record_columns_with_patient}
          name='Expediente medico'
          handleView={null}
          setInfo={setRecord}
          deleteFunc={deleteMedicalConsultation}
          modalContainer={<InfoModal data={record} />}
          hasAddbutton={false} />
      </div>
    </>
  );
}

export default MedicalRecord;