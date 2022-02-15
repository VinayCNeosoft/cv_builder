import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../config/NodeService";
import "./auth.css";
import logo from "../../assets/cv1.png";
import Footer from "../common_components/Footer";

//RegEx for Validation
const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
const RegForName = RegExp("^[a-zA-Z]{3,10}$");
const RegForPassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}$");

function Register() {
  //State Variables
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  //useRef Assigning
  const fnameRef = useRef(null);
  const lnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const cpasswordRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //handler function to perform validation
  const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "fname":
        setErrors({
          ...errors,
          first_name: RegForName.test(fnameRef.current.value)
            ? ""
            : " * Please Enter valid First Name",
        });
        setValues({ ...values, first_name: fnameRef.current.value });
        break;
      case "lname":
        setErrors({
          ...errors,
          last_name: RegForName.test(lnameRef.current.value)
            ? ""
            : " * Please Enter valid Last Name",
        });
        setValues({ ...values, last_name: lnameRef.current.value });
        break;
      case "email":
        setErrors({
          ...errors,
          email: RegForEmail.test(emailRef.current.value)
            ? ""
            : "* Uh oh! Looks like there is an issue with your email. Please input a correct email.",
        });
        setValues({ ...values, email: emailRef.current.value });
        break;
      case "password":
        setErrors({
          ...errors,
          password: RegForPassword.test(passwordRef.current.value)
            ? ""
            : "* Please Enter Password in Alphanumeric and Symbols",
        });
        setValues({ ...values, password: passwordRef.current.value });
        break;
      case "cpassword":
        setErrors({
          ...errors,
          cpassword:
            values.password === cpasswordRef.current.value
              ? ""
              : "* Password and Confirm Password must be match",
        });
        setValues({ ...values, cpassword: cpasswordRef.current.value });
        break;
      default:
        break;
    }
  };

  //formSubmit function to submit values to server
  const formSubmit = () => {
    let imagedatanew = document.querySelector('input[type="file"]').files[0];
    if (
      values.first_name !== "" &&
      values.last_name !== "" &&
      values.email !== "" &&
      values.password !== "" &&
      values.cpassword !== ""
    ) {
      if (
        errors.first_name === "" &&
        errors.last_name === "" &&
        errors.email === "" &&
        errors.password === "" &&
        errors.cpassword === ""
      ) {
        let formDataNew = new FormData();
        formDataNew.append("first_name", values.first_name);
        formDataNew.append("last_name", values.last_name);
        formDataNew.append("email", values.email);
        formDataNew.append("password", values.password);
        formDataNew.append("profileImg", imagedatanew);
        console.log(formDataNew);
        const config = {
          headers: {
            "Content-Type":
              "multipart/form-data; boundary=AaB03x" +
              "--AaB03x" +
              "Content-Disposition: file" +
              "Content-Type: png" +
              "Content-Transfer-Encoding: binary" +
              "...data... " +
              "--AaB03x--",
            Accept: "application/json",
            type: "formData",
            Authentication: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        localStorage.setItem("email", values.email);
        registerUser(formDataNew, config).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            toast(`${res.data.message}`);
            localStorage.setItem(
              "mail_VERIFICATION_TOKEN",
              `${res.data.email_verification_token}`
            );
            navigate("/");
          } else if (res.data.success === false) {
            console.log(res.data);
            toast(`${res.data.message}`);
          }
        });
      } else {
        toast("Validation Error");
      }
    } else {
      toast("Input Fields must not be blank");
    }
  };

  return (
    <>
      <Row>
        <Col xl={12}>
          <Container
            fluid
            style={{
              backgroundImage: `url("https://assets.wallpapersin4k.org/uploads/2017/04/Web-Page-Wallpaper-10.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              paddingTop: "2em",
              paddingBottom: "2em",
            }}
          >
            <Container>
              <div className="App">
                <div className="text-center">
                  <img
                    src={logo}
                    className="log_reg_logo"
                    alt="not found"
                  ></img>
                </div>
                <h2 className="text-center text-info">Create Your Account</h2>
                <Form className="form" encType="multipart/form-data">
                  <Form.Group className="mb-3">
                    <Form.Label className="label">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fname"
                      ref={fnameRef}
                      isValid={values.first_name !== "" ? true : false}
                      isInvalid={errors.first_name !== "" ? true : false}
                      onChange={(e) => handler(e)}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="label">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lname"
                      ref={lnameRef}
                      isValid={values.last_name !== "" ? true : false}
                      isInvalid={errors.last_name !== "" ? true : false}
                      onChange={(e) => handler(e)}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="label">Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      ref={emailRef}
                      isValid={values.email !== "" ? true : false}
                      isInvalid={errors.email !== "" ? true : false}
                      onChange={(e) => handler(e)}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      ref={passwordRef}
                      isValid={values.password !== "" ? true : false}
                      isInvalid={errors.password !== "" ? true : false}
                      onChange={(e) => handler(e)}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="label">Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="cpassword"
                      ref={cpasswordRef}
                      isValid={values.cpassword !== "" ? true : false}
                      isInvalid={errors.cpassword !== "" ? true : false}
                      onChange={(e) => handler(e)}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.cpassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="label">Upload Pic</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      placeholder="Profile Picture"
                    ></Form.Control>
                  </Form.Group>
                  <br />
                  <div className="text-center">
                    <Button
                      onClick={formSubmit}
                      variant="info"
                      className="reg-btn"
                    >
                      Register
                    </Button>
                    <span style={{ marginLeft: "20px" }} className="label">
                      Already have an Account ?
                      <Link to="/" className="label">
                        &nbsp;Click to Login
                      </Link>
                    </span>
                  </div>
                </Form>
              </div>
            </Container>
          </Container>
        </Col>
      </Row>
      <Footer />
    </>
  );
}

export default Register;
