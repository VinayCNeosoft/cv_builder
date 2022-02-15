import React,{useState,useRef} from 'react'
import { Container ,Button,Form} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';
import { resetPassword } from '../../config/NodeService'
import Footer from '../common_components/Footer';

const RegForOtp = RegExp("^[0-9]{6}$");
const RegForPassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}$");

function ResetPassword() {
    const [values, setValues] = useState({
        otp:"",
        password: "",
        cpassword: "",
    });
      const [errors, setErrors] = useState({
        otp:"",
        password: "",
        cpassword: ""
    });
    const otpRef = useRef(null)
    const passwordRef = useRef(null);
    const cpasswordRef = useRef(null);
    const navigate = useNavigate()

    const handler = (e) => {
        let name = e.target.name;
        switch (name) {
            case "otp":
                setErrors({...errors,otp: RegForOtp.test(otpRef.current.value)? ""
                : "* Please Enter 6 digit OTP",
                });
                setValues({ ...values, otp: otpRef.current.value });
            break;
            case "password":
                setErrors({...errors,password: RegForPassword.test(passwordRef.current.value)? ""
                : "* Please Enter Password in Alphanumeric and Symbols",
                });
                setValues({ ...values, password: passwordRef.current.value });
            break;
            case "cpassword":
                setErrors({...errors,cpassword:values.password === cpasswordRef.current.value? ""
                : "* Password and Confirm Password must be match",
                });
                setValues({ ...values, cpassword: cpasswordRef.current.value });
            break;
            default:
            break;
        }
    };
    const resetPass=()=>{
        if(values.otp!=='' && values.password!=='' && values.cpassword!==''){
            if(errors.otp==='' && errors.password==='' && errors.cpassword===''){
                console.log(values)
                resetPassword(values).then(res=>{
                    if(res.data.success===true){
                        localStorage.setItem("otp",res.data.otp)
                        toast(`${res.data.message}`)
                        localStorage.setItem("otp",'')
                        navigate("/")
                    }
                    if(res.data.success===false){
                        console.log(res.data)
                        toast(`${res.data.message}`)
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
       <Container fluid style={{backgroundImage:`url("https://assets.wallpapersin4k.org/uploads/2017/04/Web-Page-Wallpaper-10.jpg")`,backgroundSize: "cover",backgroundPosition:"center",paddingTop:"2.5em",paddingBottom:"2.6em"}}>

        <div className='App'>
            <br/>
            <Container>
                <Container>
                    <h1 className='text-center'>Reset Password</h1>
                    <Form className="form">
                        <Form.Group className="mb-3">
                            <Form.Label className="label">OTP</Form.Label>
                            <Form.Control
                                type="number"
                                name="otp"
                                ref={otpRef}
                                isValid={values.otp !== "" ? true : false}
                                isInvalid={errors.otp !== "" ? true : false}
                                onChange={(e) => handler(e)}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.otp}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="label">New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                ref={passwordRef}
                                isValid={values.password !== "" ? true : false}
                                isInvalid={errors.password !== "" ? true : false}
                                onChange={(e) => handler(e)}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="label">Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="cpassword"
                                ref={cpasswordRef}
                                isValid={values.cpassword !== "" ? true : false}
                                isInvalid={errors.cpassword !== "" ? true : false}
                                onChange={(e) => handler(e)}>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                            {errors.cpassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div>
                        <Button
                            onClick={resetPass}
                            variant="primary"
                            className="reg-btn"
                        > Reset Password
                        </Button>
                        </div>
                    </Form>
                </Container>
            </Container>
        </div>
        </Container>
        <Footer/>
        </>
    )
}

export default ResetPassword
