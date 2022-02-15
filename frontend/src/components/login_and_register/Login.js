import React,{useState, useRef,useEffect} from 'react';
import {Form, Button, Container} from 'react-bootstrap';
import { loginUser } from '../../config/NodeService';
import {Link, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./auth.css";
import logo from '../../assets/cv1.png'
import Footer from '../common_components/Footer'

//RegEx for Validation
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$');
const RegForPassword = RegExp('^[a-zA-Z0-9@*!&%$]{8,15}$')

function Login() {
    //State Variables
    const [values,setValues] = useState({email:'',password:''})
    const [errors,setErrors] = useState({email:'',password:''})

    //useRef Assigning
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem("token")){
            navigate("/dashboard")
        }
        else{
            navigate("/")
        }
    },[navigate])

    //handler function to perform validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'email':
                setErrors({...errors,email:RegForEmail.test(emailRef.current.value)?'':'Please Enter Email in correct format'})
                setValues({...values,email:emailRef.current.value})
            break
            case 'password':
                setErrors({...errors,password:RegForPassword.test(passwordRef.current.value)?'':'Please Enter Password in Alphanumeric and Symbols'})
                setValues({...values,password:passwordRef.current.value})
            break
            default:
            break
        }
    }

    //formSubmit function to submit values to server
    const formSubmit = () =>{
        if(values.email!=='' && values.password!==''){
            if(errors.email==='' && errors.password===''){
                console.log(values)
                loginUser(values)
                .then(res=>{
                    if(res.data.success===true){
                        console.log(res.data)
                        console.log(res.data.user)
                        localStorage.setItem("token",res.data.token);
                        localStorage.setItem("email",values.email);
                        navigate("/dashboard")
                    }
                    if(res.data.success===false){
                        console.log(res.data)
                        toast(`${res.data.message}`);
                        emailRef.current.value=""
                        passwordRef.current.value=""
                        setValues({...values,email:"",password:""})
                    }
                })
            }
            else{
                toast("Validation Error")
            }
        }
        else{
            toast("Input Field must not be blanked")
        }
    }

    return (
        <>
            <Container fluid style={{backgroundImage:`url("https://assets.wallpapersin4k.org/uploads/2017/04/Web-Page-Wallpaper-10.jpg")`,backgroundSize: "cover",backgroundPosition:"center",paddingTop:"3em",paddingBottom:"3.3em"}}>
                <Container>
                <div className='App'>
                  <div className='text-center'>
                    <img src={logo} className="log_reg_logo" alt="not found"></img>
                  </div>
                <h2 className="text-center text-info">Login to Your Account</h2>
                <Form className='form'>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Email</Form.Label>
                        <Form.Control type="text" name="email" ref={emailRef} isValid={values.email!==''?true:false} isInvalid={errors.email!==''?true:false} onChange={e => handler(e)}></Form.Control>
                        <Form.Control.Feedback type="invalid" className='error'>{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Password</Form.Label>
                        <Form.Control type="password" name="password" ref={passwordRef} isValid={values.password!==''?true:false} isInvalid={errors.password!==''?true:false} onChange={e => handler(e)}></Form.Control>
                        <Form.Control.Feedback type="invalid" className='error'>{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                    <div className="text-center">
                        <Button onClick={formSubmit} variant="info" className='log-btn'>Login</Button><span style={{marginLeft:"20px" ,textDecoration:"none"}}><Link to="/register" className='label'>New User ? Click to Register</Link></span> | <span><Link to="/forgetpassword" className='label'>Forget Password</Link></span>
                    </div>
                </Form>
                </div>
            </Container>
            </Container>
            <Footer/>
        </>
    )
}

export default Login