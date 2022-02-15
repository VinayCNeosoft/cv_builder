import React,{useState,useEffect} from 'react';
import {Button, Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { FaUserCircle} from 'react-icons/fa';
import { useNavigate ,Link,NavLink} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/cv1.png'
import './common.css'


function Header() {
    const [user,setUser] = useState()
    const navigate = useNavigate();

    /*setInterval was used in order to refresh the page constantly
    in order to have the "logout" button show immediately in place of
    "login", as soon as user logs out.*/

    useEffect(() => {
        setInterval(() => {
            setUser(localStorage.getItem("token"))
        },[1000])
    }, [user]);

    const logout = () => {
        localStorage.removeItem("status");
        localStorage.removeItem("token");
        localStorage.removeItem("password");
        localStorage.removeItem("user")
        localStorage.removeItem("email")
        localStorage.removeItem("mail_VERIFICATION_TOKEN")
        toast("User Logged Out Successfully")
        navigate("/")
    }
    if (!user) {
        return (
        <>
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
            <Container>
            <Navbar.Brand><Link to="/"><img
                src={logo}
                width="40"
                height="40"
                className="d-inline-block align-top"
                alt="CV Builder logo"
            /></Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                </Nav>
                <Nav>
                <Button variant='outline-primary' size='sm' >
                    <NavDropdown title={<FaUserCircle/>} id="collasible-nav-dropdown" >
                        <NavLink className="nav_link" to="/">Login</NavLink>
                        <hr/>
                        <NavLink className="nav_link" to="/register">Register</NavLink>
                    </NavDropdown>
                </Button>
               </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
        )
    }
    if (user) {
        return (
            <>
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
            <Navbar.Brand><Link to="/"><img
                src={logo}
                width="40"
                height="40"
                className="d-inline-block align-top"
                alt="CV Builder logo"
            /></Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <NavLink to="/" className="nav_link_header" >Home</NavLink>
             </Nav>
                <Nav>
                <Button variant='outline-success' size='sm' >
                    <NavDropdown title={<FaUserCircle/>} id="collasible-nav-dropdown" >
                        <NavDropdown.Item className='btn' onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Button>
               </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
        )
    }
}

export default Header