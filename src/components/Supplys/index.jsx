
import DataTable from "../Table";
import { useState } from "react";
import { useEffect } from "react";
import Patient from '../Patient';
import { supplys_columns } from '../headers'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddModal from "./AddModal";
import SupplyInfoModal from "./infoModal";
import AuthProvider from "../../context/AuthContext";
import { useContext } from "react";

function Supplys() {

  const [data, setData] = useState([]);
  const [allInfo, setallInfo] = useState(true);
  const [supply, setSupply] = useState({});
  const { authTokens, logoutUser } = useContext(AuthProvider);

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
          logoutUser();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const deleteMedicalSupplys = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + authTokens['token']);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/medical_supplys/" + id + "/", requestOptions)
      .then(response => {
        if (response.status !== 200 && response.status !== 204) {
          logoutUser();
        } else {
          var prev = [...data];
          prev.splice(prev.findIndex(e => e.id === id), 1);
          setData(prev);
          toast.success('Se elimino el insumo exitosamente');
        }
      }
      ).then(result => {
      })
      .catch(error => toast.error('Error al eliminar paciente'));
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

      <DataTable
        rows={data}
        columns={supplys_columns}
        name='Insumos'
        setallInfo={setallInfo}
        setInfo={setSupply}
        deleteFunc={deleteMedicalSupplys}
        handleView={null}
        modalContainer={<SupplyInfoModal data={supply} />}
        addModal={<AddModal />}
        hasAddbutton={true}
      />

    </div>
  );
}

export default Supplys;