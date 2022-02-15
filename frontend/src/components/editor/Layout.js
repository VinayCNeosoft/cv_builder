import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Table, Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiDocumentDownload } from "react-icons/hi";
import "./editor.css";
import img_pic from "../../assets/default_av.png";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "../editor/editor.css";
import { getCustomer } from "../../config/NodeService";

function Layout(props) {
  const [image, setImage] = useState();

  const [logo, setLogo] = useState(true);
  const [showModal, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("token") === "") {
      navigate("/");
    } else {
      let email = localStorage.getItem("email");
      getCustomer(email).then((res) => {
        if (res.data.success === true) {
          setImage(res.data.data.logo);
          if (res.data.data.logo === undefined) {
            console.log("profile pic not present");
            setLogo(true);
          } else {
            console.log("profile pic present");
            setLogo(false);
          }
        } else if (res.data.success === false) {
          console.log(res.data);
          // alert(`${res.data.message}`)
        } else {
          console.log("");
        }
      });
    }
  }, [navigate]);

  const downloadPdfDocument = () => {
    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("download.pdf");
    });
    navigate("/dashboard");
  };

  return (
    <>
      <div className="container fluid model_pointer" ref={inputRef}>
        <Row className="cv_View " onClick={() => handleShow(true)}>
          <Col xl={4} sm={4} className="left-col cv-view-col">
            {logo ? (
              <>
                <div className="text-center">
                  <img src={img_pic} className="pro_pic" alt="not Found" />
                </div>
                <br />
                <br />
              </>
            ) : (
              <>
                <div className="text-center">
                  <img src={img_pic} className="pro_pic" alt="not Found" />
                </div>
                <br />
                <br />
              </>
            )}
            <h6 className="text-warning text-center">
              {props.profile.basic.first_name}&nbsp;
              {props.profile.basic.last_name}
            </h6>
            <h5 className="pro-contact">Contact : </h5>
            <h6 className="pro-heading ">Email</h6>
            <p className="text-warning w-wrap">{props.profile.basic.email}</p>
            <h6 className="pro-heading">Phone</h6>
            <p className="text-warning">{props.profile.basic.phone}</p>
            <h6 className="pro-heading">Address</h6>
            <p className="text-warning">
              {props.profile.basic.address}&nbsp;{props.profile.basic.city}
              &nbsp;
              <br />
              {props.profile.basic.state}&nbsp;{props.profile.basic.pincode}
            </p>
            <br />
            <br />
            <h5 className="pro-skills">Skills : </h5>
            {props.profile.skill.length > 0 ? (
              <>
                {props.profile.skill.map((client, i) => (
                  <>
                    <p key={i} className="text-warning">
                      {client.skillName} {client.perfection}% perfection
                    </p>

                    {/* <progress value={client.perfection} max="100"/> */}
                  </>
                ))}
              </>
            ) : (
              <>
                <p className="text-warning">Add Skill Detail</p>
              </>
            )}
            <br />
            <h5 className="pro-skills ">Social Profile : </h5>
            {props.profile.socialProfile.length > 0 ? (
              <>
                {props.profile.socialProfile.map((client, i) => (
                  <div key={i}>
                    <p className="text-warning">{client.platformName}</p>
                    <p className="text-warning w-wrap">{client.platformLink}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                <p className="text-warning">Add Social Profile Detail</p>
              </>
            )}
          </Col>
          <Col xl={8} sm={8} className="right-col cv-view-col">
            <>
              <div className="bio">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.profile.basic.bio}
              </div>
              <hr />
              <h4>Education</h4>
              <hr />
              <div>
                {props.profile.education.length > 0 ? (
                  <>
                    <Table borderless size="sm" responsive="xl">
                      <tbody>
                        {props.profile.education.map((data, index) => (
                          <>
                            <tr key={index}>
                              <th rowSpan={2}>{data.degree_name}</th>
                              <th>{data.institute_name}</th>
                            </tr>
                            <tr>
                              <td>{data.percentage} %</td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <>Add Education Detail</>
                )}
              </div>
              <hr />
              <h4>Experience</h4>
              <hr />
              <div>
                {props.profile.experience.length > 0 ? (
                  <>
                    <Table borderless size="sm" responsive="xl">
                      <tbody>
                        {props.profile.experience.map((data, index) => (
                          <>
                            <tr key={index}>
                              <th rowSpan={6}>
                                {data.joiningDate}-{data.leavingDate}
                              </th>
                            </tr>
                            <tr>
                              <td>{data.organizationName}</td>
                            </tr>
                            <tr>
                              <td>{data.joiningLocation}</td>
                            </tr>
                            <tr>
                              <td>{data.position}</td>
                            </tr>
                            <tr>
                              <td>{data.ctc}</td>
                            </tr>
                            <tr>
                              <td>{data.technologiesWorkedOn}</td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <>Add Experience Detail</>
                )}
              </div>
              <hr />
              <h4>Projects</h4>
              <hr />
              <div>
                {props.profile.project.length > 0 ? (
                  <>
                    <Table borderless size="sm" responsive="xl">
                      <tbody>
                        {props.profile.project.map((data, index) => (
                          <>
                            <tr key={index}>
                              <th rowSpan={5}>
                                <b>{data.projectTitle}</b>
                              </th>
                            </tr>
                            <tr>
                              <td>
                                Team Size: <b>{data.teamSize}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Duration: <b>{data.duration}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Technology Used: <b>{data.techUsed}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Description: <b>{data.descProj}</b>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <>Add Project Detail</>
                )}
              </div>
              <br />
            </>
          </Col>
        </Row>
      </div>

      <div className="text-center mt-5">
        <Button variant="outline-info" onClick={() => handleShow(true)}>
          <FaEye /> &nbsp;Preview
        </Button>
      </div>
      <div className="text-center mt-5">
        {props.profile.download ? (
          <>
            <Button variant="outline-success" onClick={downloadPdfDocument}>
              <HiDocumentDownload /> &nbsp;Download
            </Button>
          </>
        ) : (
          <></>
        )}
      </div>
      <Modal size="lg" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="container model_pointer">
            <Row className="cv_View " onClick={() => handleShow(true)}>
              <Col sm={4} className="left-col cv-view-col">
                <div className="text-center">
                  {logo ? (
                    <>
                      <img src={img_pic} className="pro_pic" alt="not Found" />
                      <br />
                      <br />
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <img src={image} className="pro_pic" alt="not Found" />
                      </div>
                      <br />
                      <br />
                    </>
                  )}
                </div>
                <h6 className="text-warning text-center">
                  {props.profile.basic.first_name}&nbsp;
                  {props.profile.basic.last_name}
                </h6>
                <h5 className="pro-contact">Contact : </h5>
                <h6 className="pro-heading">Email</h6>
                <p className="text-warning w-wrap">
                  {props.profile.basic.email}
                </p>
                <h6 className="pro-heading">Phone</h6>
                <p className="text-warning">{props.profile.basic.phone}</p>
                <h6 className="pro-heading">Address</h6>
                <p className="text-warning">
                  {props.profile.basic.address}&nbsp;{props.profile.basic.city}
                  &nbsp;
                  <br />
                  {props.profile.basic.state}&nbsp;{props.profile.basic.pincode}
                </p>
                <br />
                <br />
                <h5 className="pro-skills">Skills : </h5>
                {props.profile.skill.length > 0 ? (
                  <>
                    {props.profile.skill.map((client, i) => (
                      <>
                        <div key={i}>
                          <p className="text-warning">
                            {client.skillName} {client.perfection}% perfection
                          </p>
                        </div>
                        {/* <progress value={client.perfection} max="100"/> */}
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="text-warning">Add Skill Detail</p>
                  </>
                )}
                <br />
                <h5 className="pro-skills ">Social Profile : </h5>
                {props.profile.socialProfile.length > 0 ? (
                  <>
                    {props.profile.socialProfile.map((client, i) => (
                      <>
                        <div key={i}>
                          <p className="text-warning">{client.platformName}</p>
                          <p className="text-warning w-wrap">
                            {client.platformLink}
                          </p>
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="text-warning">Add Social Profile Detail</p>
                  </>
                )}
              </Col>
              <Col sm={8} className="right-col cv-view-col">
                <>
                  <div className="bio  w-wrap">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {props.profile.basic.bio}
                  </div>
                  <hr />
                  <h4>Education</h4>
                  <hr />
                  <div>
                    {props.profile.education.length > 0 ? (
                      <>
                        <Table borderless size="sm" responsive="xl">
                          <tbody>
                            {props.profile.education.map((data, index) => (
                              <>
                                <tr key={index}>
                                  <th rowSpan={2}>{data.degree_name}</th>
                                  <th>{data.institute_name}</th>
                                </tr>
                                <tr>
                                  <td>{data.percentage} %</td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </Table>
                      </>
                    ) : (
                      <>Add Education Detail</>
                    )}
                  </div>
                  <hr />
                  <h4>Experience</h4>
                  <hr />
                  <div>
                    {props.profile.experience.length > 0 ? (
                      <>
                        <Table borderless size="sm" responsive="xl">
                          <tbody>
                            {props.profile.experience.map((data, index) => (
                              <>
                                <tr key={index}>
                                  <th rowSpan={6}>
                                    {data.joiningDate}-{data.leavingDate}
                                  </th>
                                </tr>
                                <tr>
                                  <td>{data.organizationName}</td>
                                </tr>
                                <tr>
                                  <td>{data.joiningLocation}</td>
                                </tr>
                                <tr>
                                  <td>{data.position}</td>
                                </tr>
                                <tr>
                                  <td>{data.ctc}</td>
                                </tr>
                                <tr>
                                  <td>{data.technologiesWorkedOn}</td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </Table>
                      </>
                    ) : (
                      <>Add Experience Detail</>
                    )}
                  </div>
                  <hr />
                  <h4>Projects</h4>
                  <hr />
                  <div>
                    {props.profile.project.length > 0 ? (
                      <>
                        <Table borderless size="sm" responsive="xl">
                          <tbody>
                            {props.profile.project.map((data, index) => (
                              <>
                                <tr key={index}>
                                  <th rowSpan={5}>
                                    <b>{data.projectTitle}</b>
                                  </th>
                                </tr>
                                <tr>
                                  <td>
                                    Team Size: <b>{data.teamSize}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Duration: <b>{data.duration}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Technology Used: <b>{data.techUsed}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Description: <b>{data.descProj}</b>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </Table>
                      </>
                    ) : (
                      <>Add Project Detail</>
                    )}
                  </div>
                  <br />
                </>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Layout;
