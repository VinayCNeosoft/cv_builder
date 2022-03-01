import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import Footer from "../components/common_components/Footer";
import "./dash.css";
// import jwt_decode from "jwt-decode";
import samp_img from "../assets/samp2.png";
import EditCv from "./EditCv";
// import { getAllPdf } from "../config/NodeService";

function Dashboard() {
  const [uid, setUid] = useState(null);
  const [isCvEmpty, setIsCvEmpty] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const gotoEditor = () => {
    navigate("/create_cv");
  };

  return (
    <>
      <Container fluid className="main-dash">
        <Container>
          <p className="heading">Online CV Builder</p>
          <Row className="dash-left">
            <Col xl={6}>
              <h1 className="dash-content">
                Create a Professional CV for Free.
              </h1>
              <h5 className="justify-content-center dash-h5">
                CV writing can be stressful, confusing, and time-consuming if
                you do it all on your own. With this CV Builder, it’s quick,
                pain-free, and effective.
              </h5>
              <div className="text-center">
                <Button
                  variant="outline-primary btn-create-cv"
                  onClick={gotoEditor}
                >
                  Create Your CV Now
                </Button>
              </div>
            </Col>
            <Col xl={6}>
              <div className="container fluid text-center">
                <img src={samp_img} alt="dashboard pic" width={"100%"} />
              </div>
            </Col>
          </Row>
          <hr />
        </Container>
      </Container>
      <EditCv />
      {/* {isCvEmpty ? (
        <></>
      ) : (
        <>
          <EditCv />
        </>
      )} */}
      <br />
      <Footer />
    </>
  );
}

export default Dashboard;

/*useEffect(()=>{
        if(localStorage.getItem("token")){
          let token=localStorage.getItem('token');
            let decode=jwt_decode(token);
            setUid(decode.uid)
            getAllPdf(decode.uid)
              .then(res=>{
                  if(res.data.success===true){
                    if(res.data.data.pdfData.length>0)
                    {
                      setIsCvEmpty(false)
                    }
                  }
                  else if(res.data.success===false){
                      console.log("CV is empty")
                      setIsCvEmpty(true)
                  }
                  else{
                      console.log("")
                  }
            })
        }
        else{
            navigate("/")
        }
  }, [navigate])
 */
