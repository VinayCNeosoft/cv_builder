import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Table, Modal, Button, Container } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiDocumentDownload } from "react-icons/hi";
import { jsPDF } from "jspdf";
import { getCustomer } from "../../config/NodeService";
import img_pic from "../../assets/default_av.png";
import html2canvas from "html2canvas";
import "../editor/editor.css";

function Layout(props) {
  const [image, setImage] = useState();
  const [logo, setLogo] = useState(true);
  const [showModal, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const inputRef = useRef(null);

  useEffect(() => {
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
  }, [navigate]);

  const downloadPdfDocument = () => {
    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", [210, 297], "a4");
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      if (pdfHeight > 297) {
        pdf.insertPage(pdf);
      }
      pdf.save("download.pdf");
    });
    navigate("/dashboard");
  };

  const downloadPdfModel = () => {
    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", [210, 297], "letter");

      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      if (pdfHeight > 297) {
        pdf.insertPage(pdf);
      }
      pdf.save("download.pdf");
    });
    navigate("/dashboard");
  };

  return (
    <>
      <div
        className="container fluid model_pointer mt-3"
        ref={inputRef}
        onClick={() => handleShow(true)}
      >
        {logo ? (
          <>
            <div className="outerDiv">
              <div className="leftDiv">
                <img src={img_pic} className="pro_pic" alt="not Found" />
              </div>
              <div className="rightDiv">
                <h6 className=" text-left">
                  &nbsp;{props.profile.basic.first_name}&nbsp;
                  {props.profile.basic.last_name}
                </h6>
                <div className="containerIntro">
                  <h6 align="right" className="pro-heading "></h6>
                  <p align="right" className=" w-wrap">
                    &nbsp;{props.profile.basic.email}
                  </p>
                </div>
                <div className="containerIntro">
                  <h6 align="right" className="pro-heading"></h6>
                  <p align="right">&nbsp;{props.profile.basic.phone}</p>
                </div>
                <div className="containerIntro">
                  <h6 align="right" className="pro-heading"></h6>
                  <p align="right">
                    &nbsp;{props.profile.basic.address}&nbsp;
                    {props.profile.basic.city}
                    &nbsp;
                    <br />
                    &nbsp;
                    {props.profile.basic.state}&nbsp;
                    {props.profile.basic.pincode}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="outerDiv">
              <div className="leftDiv">
                <img src={img_pic} className="pro_pic" alt="not Found" />
              </div>
              <div className="rightDiv">
                <h6 className=" text-left">
                  &nbsp;{props.profile.basic.first_name}&nbsp;
                  {props.profile.basic.last_name}
                </h6>
                <div className="containerIntro">
                  <h6 align="right" className="pro-heading "></h6>
                  <p align="right" className=" w-wrap">
                    &nbsp;{props.profile.basic.email}
                  </p>
                </div>
                <div className="containerIntro">
                  <h6 align="right" className="pro-heading"></h6>
                  <p align="right">&nbsp;{props.profile.basic.phone}</p>
                </div>
                <div className="containerIntro">
                  <h6 align="right" className="pro-heading"></h6>
                  <p align="right">
                    &nbsp;{props.profile.basic.address}&nbsp;
                    {props.profile.basic.city}
                    &nbsp;
                    <br />
                    &nbsp;
                    {props.profile.basic.state}&nbsp;
                    {props.profile.basic.pincode}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        <hr />
        <Container>
          <div className="bio ">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.profile.basic.bio}
          </div>
        </Container>

        <Container>
          <hr />
          <h5 className="pro-skills">Education :</h5>
          <hr />
          <div className="edu_table">
            {props.profile.education.length > 0 ? (
              <>
                <Table borderless size="sm" responsive="xl">
                  <thead>
                    <tr>
                      <th>Degree Name</th>
                      <th>Institute Name</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.profile.education.map((data) => (
                      <tr key={data.id}>
                        <td>{data.degree_name}</td>
                        <td>{data.institute_name}</td>
                        <td>{data.percentage} %</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <p>Add Education Detail</p>
              </>
            )}
          </div>
          {props.profile.check ? (
            <>
              <hr />
              <h5 className="pro-skills">Experience :</h5>
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
                  <>
                    <p>Add Experience Detail</p>
                  </>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
          <hr />
          <h5 className="pro-skills">Projects :</h5>
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
              <>
                <p>Add Project Detail </p>
              </>
            )}
          </div>
          <br />
          <h5 className="pro-skills">Skills : </h5>
          {props.profile.skill.length > 0 ? (
            <>
              {props.profile.skill.map((client, i) => (
                <>
                  <p key={i}>
                    {client.skillName} {client.perfection}% perfection
                  </p>

                  {/* <progress value={client.perfection} max="100"/> */}
                </>
              ))}
            </>
          ) : (
            <>
              <p>Add Skill Detail</p>
            </>
          )}
          <br />
          <h5 className="pro-skills ">Social Profile : </h5>
          {props.profile.socialProfile.length > 0 ? (
            <>
              {props.profile.socialProfile.map((client, i) => (
                <div key={i}>
                  <p>{client.platformName}</p>
                  <p className=" w-wrap">{client.platformLink}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              <p>Add Social Profile Detail</p>
            </>
          )}
        </Container>
        <br />
        {/*   <Row className="cv_View " onClick={() => handleShow(true)}>
          <Col xl={4} sm={4} className="left-col cv-view-col">
            <br />
            <br />
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
                      <thead>
                        <tr>
                          <th>Degree Name</th>
                          <th>Institute Name</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.profile.education.map((data) => (
                          <tr key={data.id}>
                            <td>{data.degree_name}</td>
                            <td>{data.institute_name}</td>
                            <td>{data.percentage} %</td>
                          </tr>
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
        </Row> */}
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
          <div
            className="container model_pointer"
            ref={inputRef}
            // style={{ backgroundColor: "darkblue" }}
          >
            {logo ? (
              <>
                <div className="outerDiv">
                  <div className="leftDiv">
                    <img src={img_pic} className="pro_pic" alt="not Found" />
                  </div>
                  <div className="rightDiv">
                    <h6 className=" text-left">
                      &nbsp;{props.profile.basic.first_name}&nbsp;
                      {props.profile.basic.last_name}
                    </h6>
                    <div className="containerIntro">
                      <h6 align="right" className="pro-heading "></h6>
                      <p align="right" className=" w-wrap">
                        &nbsp;{props.profile.basic.email}
                      </p>
                    </div>
                    <div className="containerIntro">
                      <h6 align="right" className="pro-heading"></h6>
                      <p align="right">&nbsp;{props.profile.basic.phone}</p>
                    </div>
                    <div className="containerIntro">
                      <h6 align="right" className="pro-heading"></h6>
                      <p align="right">
                        &nbsp;{props.profile.basic.address}&nbsp;
                        {props.profile.basic.city}
                        &nbsp;
                        <br />
                        &nbsp;
                        {props.profile.basic.state}&nbsp;
                        {props.profile.basic.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="outerDiv">
                  <div className="leftDiv">
                    <img src={img_pic} className="pro_pic" alt="not Found" />
                  </div>
                  <div className="rightDiv">
                    <h6 className=" text-left">
                      &nbsp;{props.profile.basic.first_name}&nbsp;
                      {props.profile.basic.last_name}
                    </h6>
                    <div className="containerIntro">
                      <h6 align="right" className="pro-heading "></h6>
                      <p align="right" className=" w-wrap">
                        &nbsp;{props.profile.basic.email}
                      </p>
                    </div>
                    <div className="containerIntro">
                      <h6 align="right" className="pro-heading"></h6>
                      <p align="right">&nbsp;{props.profile.basic.phone}</p>
                    </div>
                    <div className="containerIntro">
                      <h6 align="right" className="pro-heading"></h6>
                      <p align="right">
                        &nbsp;{props.profile.basic.address}&nbsp;
                        {props.profile.basic.city}
                        &nbsp;
                        <br />
                        &nbsp;
                        {props.profile.basic.state}&nbsp;
                        {props.profile.basic.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <hr />
            <Container>
              <div className="bio ">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.profile.basic.bio}
              </div>
            </Container>

            <Container>
              <hr />
              <h5 className="pro-skills">Education :</h5>
              <hr />
              <div className="edu_table">
                {props.profile.education.length > 0 ? (
                  <>
                    <Table borderless size="sm" responsive="xl">
                      <thead>
                        <tr>
                          <th>Degree Name</th>
                          <th>Institute Name</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.profile.education.map((data) => (
                          <tr key={data.id}>
                            <td>{data.degree_name}</td>
                            <td>{data.institute_name}</td>
                            <td>{data.percentage} %</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <>
                    <p>Add Education Detail</p>
                  </>
                )}
              </div>
              <hr />
              {props.profile.check ? (
                <>
                  <hr />
                  <h5 className="pro-skills">Experience :</h5>
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
                      <>
                        <p>Add Experience Detail</p>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
              <hr />
              <h5 className="pro-skills">Projects :</h5>
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
                  <>
                    <p>Add Project Detail </p>
                  </>
                )}
              </div>
              <br />
              <h5 className="pro-skills">Skills : </h5>
              {props.profile.skill.length > 0 ? (
                <>
                  {props.profile.skill.map((client, i) => (
                    <>
                      <p key={i}>
                        {client.skillName} {client.perfection}% perfection
                      </p>

                      {/* <progress value={client.perfection} max="100"/> */}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <p>Add Skill Detail</p>
                </>
              )}
              <br />
              <h5 className="pro-skills ">Social Profile : </h5>
              {props.profile.socialProfile.length > 0 ? (
                <>
                  {props.profile.socialProfile.map((client, i) => (
                    <div key={i}>
                      <p>{client.platformName}</p>
                      <p className=" w-wrap">{client.platformLink}</p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p>Add Social Profile Detail</p>
                </>
              )}
            </Container>
            <br />
          </div>
          <br />
          <div className="text-center">
            <Button variant="outline-success" onClick={downloadPdfModel}>
              <HiDocumentDownload /> &nbsp;Download
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Layout;

/*  const downloadPdfDocument = () => {
    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", [210, 297], "a4");
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      if (pdfHeight > 297) {
        pdf.insertPage(pdf);

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }
      pdf.save("download.pdf");
    });
    navigate("/dashboard");
  };

  const downloadPdfModel = () => {
    html2canvas(inputRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", [210, 297], "letter");

      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      if (pdfHeight > 297) {
        pdf.insertPage(pdf);

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }
      pdf.save("download.pdf");
    });
    navigate("/dashboard");
  }; */
