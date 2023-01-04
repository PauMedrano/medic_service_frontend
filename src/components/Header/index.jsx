import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import { FaClinicMedical } from '@react-icons/all-files/fa/FaClinicMedical';
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import './index.css'

const Header = () => {
  const { authTokens, logoutUser  } = useContext(AuthContext);
  return (
    <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: '#D5E4E6' }}>
      <Container >
        <Navbar.Brand href="/" style={{ fontSize: '30px' }}> <FaClinicMedical size={50} style={{ marginRight: '1px' }} /> <span style = {{marginRight : '2em'}}>Servicio médico</span></Navbar.Brand>
        {authTokens && <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" style={{ marginRight: '1em' }}>
            <Nav className="me-auto" >
              <Link className = 'link' to="/"> Inicio </Link>
              <Link className = 'link' to="/patients"> Pacientes </Link>
              <Link className = 'link' to="/medic-consultations" >Consulta médica</Link>
              <Link className = 'link' to="/medical-records" >Expediente médico</Link>
              <Link className = 'link' to="/report" >Reportes trimestrales</Link>
              <Link className = 'link' to="/supplys"  >Inventario insumos</Link>
            </Nav>
          </Navbar.Collapse>
        </>}
        <Button variant="light" style={{ marginRight: '1px' }} onClick ={() => { logoutUser()}}>Cerrar</Button>
      </Container>
    </Navbar>
  );
}

export default Header;