import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Button, Row, Col } from 'react-bootstrap';
import image from './images/upiiz.jpg';
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 

function Login() {
    const { loginUser } = useContext(AuthContext);
    const handleSubmit = async e => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        var result = await loginUser(username, password);
        if (result == -1) {
            toast.error('Usuario o contraseña incorrecta')
        }
        console.log(result);
    };
    return (
        <Container style={{ marginTop: '2em', width: '50%', textAlign: 'center', boxShadow: '1px 2px 9px #D5E4E6', paddingBottom: '150px' }}>
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
            <Row >
                <Col>
                    <img style={{ width: '200px', height: '200px' }} src={image} alt="" />
                </Col>
            </Row>
            <Row >
                <Col class="col-sm-6 mx-auto" >
                    <Container id="main-container" className="d-grid h-100" style={{ width: '50%' }}>
                        <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={handleSubmit}>
                            <h1 className="mb-3 fs-3 fw-normal">Inicia sesion</h1>
                            <Form.Control id="username" size="lg" placeholder="Nombre de usuario" className="position-relative" />
                            <Form.Control id="password" type="password" size="lg" placeholder="Contraseña" className="position-relative" />
                            <div className="d-grid">
                                <Button type="submit" variant="primary" size="lg">Enviar</Button>
                            </div>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;