import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Container, Form, Table, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import "../components/editor/editor.css";
import jwt_decode from "jwt-decode";
import "react-icons/bs";
import { Button, Paper, StepContent, Typography } from "@mui/material";
import { BsPlus } from "react-icons/bs";
import Layout from "./editor/Layout";
import { editCV, getAllPdf } from "../config/NodeService";

import { toast } from "react-toastify";

//reg ex for basic info
const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
const RegForName = RegExp("^[a-zA-Z]{3,10}$");
const RegForPhone = RegExp("^[7-9][0-9]{9}$");
const RegForAddress = RegExp("^[a-zA-Z]{3,10}$");
const RegForCity = RegExp("^[a-zA-Z]{3,10}$");
const RegForState = RegExp("^[a-zA-Z]{3,15}$");
const RegForPincode = RegExp("^[0-9]{6}$");
//regex for education
const RegForDegreeName = RegExp("^[a-zA-Z]{3,10}$");
const RegForInstituteName = RegExp("^[a-zA-Z]{3,10}$");
const RegForDegreePercentage = RegExp("^[1-9]{2}");

function EditCv() {
  //state variable for stepper
  const [edit, setEdit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [update, setUpdateButton] = useState(false);
  const [download, setDownload] = useState(true);
  //basic detail state variable
  const [basicInfoValues, setBasicInfoValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bio: "",
  });
  const [basicInfoValuesErrors, setBasicInfoValuesErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bio: "",
  });
  //start of basic detail ref
  const fnameRef = useRef(null);
  const lnameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const pincodeRef = useRef(null);
  const bioRef = useRef(null);
  //end of basic detail ref
  //state variable for education detail
  const [educationDetail, setEducationDetail] = useState([]);
  const [educationInfoValues, setEducationInfoValues] = useState({
    id: "",
    degree_name: "",
    institute_name: "",
    percentage: "",
    isEducationArrayEmpty: true,
  });
  const [educationInfoErrors, setEducationInfoErrors] = useState({
    degree_name: "",
    institute_name: "",
    percentage: "",
  });
  //start of education detail ref
  const degreeNameRef = useRef(null);
  const instituteNameRef = useRef(null);
  const percentageRef = useRef(null);
  //end of education detail ref
  //state variable for Experience
  const [experienceDetail, setExperienceDetail] = useState([]);
  const [experience, setExperience] = useState({
    organizationName: "",
    joiningLocation: "",
    position: "",
    ctc: "",
    joiningDate: "",
    leavingDate: "",
    technologiesWorkedOn: "",
    id: "",
    isExperienceArrayEmpty: true,
  });
  const [experienceError, setExperienceError] = useState({
    organizationName: "",
    joiningLocation: "",
    position: "",
    ctc: "",
    joiningDate: "",
    leavingDate: "",
    technologiesWorkedOn: "",
  });
  //start of experience ref
  const organizationNameRef = useRef(null);
  const joiningLocationRef = useRef(null);
  const positionRef = useRef(null);
  const ctcRef = useRef(null);
  const joiningDateRef = useRef(null);
  const leavingDateRef = useRef(null);
  const technologiesWorkedOnRef = useRef(null);
  //end of experience ref
  //state variable for Projects
  const [projectsDetail, setProjectDetail] = useState([]);
  const [project, setProject] = useState({
    projectTitle: "",
    teamSize: "",
    duration: "",
    techUsed: "",
    descProj: "",
    id: "",
    isProjectArrayEmpty: true,
  });
  const [projectError, setProjectError] = useState({
    projectTitle: "",
    teamSize: "",
    duration: "",
    techUsed: "",
    descProj: "",
  });
  //start of Projects refs
  const projectTitleRef = useRef(null);
  const teamSizeRef = useRef(null);
  const durationRef = useRef(null);
  const techUsedRef = useRef(null);
  const descProjRef = useRef(null);
  //end of Projects refs
  //state variable for Skills
  const [skillDetail, setSkillDetails] = useState([]);
  const [skill, setSkill] = useState({
    skillName: "",
    perfection: "",
    id: "",
    isSkillArrayEmpty: true,
  });
  const [skillError, setSkillError] = useState({
    skillName: "",
    perfection: "",
  });
  //start of skill refs
  const skillNameRef = useRef(null);
  const perfectionRef = useRef(null);
  //end of skill refs
  //state variable for social Profile
  const [socialProfileDetail, setSocialProfileDetails] = useState([]);
  const [social, setSocial] = useState({
    platformName: "",
    platformLink: "",
    id: "",
    isPlatformArrayEmpty: true,
  });
  const [socialError, setSocialError] = useState({
    platformName: "",
    platformLink: "",
  });
  //start of social profile refs
  const platformNameRef = useRef(null);
  const platformLinkRef = useRef(null);
  //end of skill refs

  const navigate = useNavigate();
  const [cvId, setCvId] = useState();
  const [uid, setUid] = useState(null);
  const [pdf, setPdf] = useState([]);
  const [pdfIsEmpty, setPdfIsEmpty] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let decode = jwt_decode(token);
      setUid(decode.uid);
      getAllPdf(decode.uid).then((res) => {
        if (res.data.success === true) {
          if (res.data.data.pdfData.length > 0) {
            setPdfIsEmpty(false);
            setPdf(res.data.data.pdfData);
          }
        } else if (res.data.success === false) {
          console.log("CV is empty");
          setPdfIsEmpty(true);
          //   toast(`${res.data.message}`)
        } else {
          console.log("");
        }
      });
    } else {
      navigate("/");
    }
  }, [navigate]);

  // start of stepper methods
  function getSteps() {
    return [
      <b style={{ color: "purple" }}>Basic Detail</b>,
      <b style={{ color: "purple" }}>Education</b>,
      <b style={{ color: "purple" }}>Experience</b>,
      <b style={{ color: "purple" }}>Projects</b>,
      <b style={{ color: "purple" }}>Skills</b>,
      <b style={{ color: "purple" }}>Social Profiles</b>,
    ];
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /* const handleReset = () => {
        setActiveStep(0);
    }; */

  const upDateCv = () => {
    setDownload(true);
    const data = {
      id: cvId,
      profile: basicInfoValues,
      education: educationDetail,
      experience: experienceDetail,
      project: projectsDetail,
      skill: skillDetail,
      socialProfile: socialProfileDetail,
    };
    console.log(data);
    editCV(data).then((res) => {
      if (res.data.success === true) {
        console.log(res.data);
        setEdit(false);
        window.location.replace("/dashboard");
      } else if (res.data.success === false) {
        console.log(res.data);
        toast(`${res.data.msg}`);
      }
    });
  };
  // end of stepper methods

  //input handler
  const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "fname":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          first_name: RegForName.test(fnameRef.current.value)
            ? ""
            : " * Please Enter valid First Name",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          first_name: fnameRef.current.value,
        });
        break;
      case "lname":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          last_name: RegForName.test(lnameRef.current.value)
            ? ""
            : " * Please Enter valid Last Name",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          last_name: lnameRef.current.value,
        });
        break;
      case "email":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          email: RegForEmail.test(emailRef.current.value)
            ? ""
            : "* Uh oh! Looks like there is an issue with your email. Please input a correct email.",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          email: emailRef.current.value,
        });
        break;
      case "phone":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          phone: RegForPhone.test(phoneRef.current.value)
            ? ""
            : "* Please input a correct Mobile number.",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          phone: phoneRef.current.value,
        });
        break;
      case "address":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          address: RegForAddress.test(addressRef.current.value)
            ? ""
            : "* Please input a correct Address.",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          address: addressRef.current.value,
        });
        break;
      case "city":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          city: RegForCity.test(cityRef.current.value)
            ? ""
            : "* Please input a correct City Name.",
        });
        setBasicInfoValues({ ...basicInfoValues, city: cityRef.current.value });
        break;
      case "state":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          state: RegForState.test(stateRef.current.value)
            ? ""
            : "* Please input a correct State Name.",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          state: stateRef.current.value,
        });
        break;
      case "pincode":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          pincode: RegForPincode.test(pincodeRef.current.value)
            ? ""
            : "* Please input valid pincode.",
        });
        setBasicInfoValues({
          ...basicInfoValues,
          pincode: pincodeRef.current.value,
        });
        break;
      case "bio":
        setBasicInfoValuesErrors({
          ...basicInfoValuesErrors,
          bio:
            bioRef.current.value.length > 15
              ? ""
              : "* Please input a some information.",
        });
        setBasicInfoValues({ ...basicInfoValues, bio: bioRef.current.value });
        break;
      //end of basic info handler
      case "degree_name":
        setEducationInfoErrors({
          ...educationInfoErrors,
          degree_name: RegForDegreeName.test(degreeNameRef.current.value)
            ? ""
            : "* Please input  valid Degree Name",
        });
        setEducationInfoValues({
          ...educationInfoValues,
          degree_name: degreeNameRef.current.value,
        });
        break;
      case "institute_name":
        setEducationInfoErrors({
          ...educationInfoErrors,
          institute_name: RegForInstituteName.test(
            instituteNameRef.current.value
          )
            ? ""
            : "* Please input valid Institute Name",
        });
        setEducationInfoValues({
          ...educationInfoValues,
          institute_name: instituteNameRef.current.value,
        });
        break;
      case "percentage":
        setEducationInfoErrors({
          ...educationInfoErrors,
          percentage: RegForDegreePercentage.test(percentageRef.current.value)
            ? ""
            : "* Please input percentage only 2 digit number",
        });
        setEducationInfoValues({
          ...educationInfoValues,
          percentage: percentageRef.current.value,
        });
        break;
      //end of education info handler
      case "organizationName":
        setExperienceError({
          ...experienceError,
          organizationName: RegForName.test(organizationNameRef.current.value)
            ? ""
            : "* Please input complete organization name",
        });
        setExperience({
          ...experience,
          organizationName: organizationNameRef.current.value,
        });
        break;
      case "joiningLocation":
        setExperienceError({
          ...experienceError,
          joiningLocation: RegForCity.test(joiningLocationRef.current.value)
            ? ""
            : "* Please input valid Location name",
        });
        setExperience({
          ...experience,
          joiningLocation: joiningLocationRef.current.value,
        });
        break;
      case "position":
        setExperienceError({
          ...experienceError,
          position:
            positionRef.current.value.length > 2
              ? ""
              : "* Please input proper position",
        });
        setExperience({ ...experience, position: positionRef.current.value });
        break;
      case "ctc":
        setExperienceError({
          ...experienceError,
          ctc:
            ctcRef.current.value.length > 5
              ? ""
              : "* Please input ctc only numbers are allowed",
        });
        setExperience({ ...experience, ctc: ctcRef.current.value });
        break;
      case "joiningDate":
        setExperienceError({
          ...experienceError,
          joiningDate:
            joiningDateRef.current.value.length > 4
              ? ""
              : "* Please input Valid joining Date",
        });
        setExperience({
          ...experience,
          joiningDate: joiningDateRef.current.value,
        });
        break;
      case "leavingDate":
        setExperienceError({
          ...experienceError,
          leavingDate:
            leavingDateRef.current.value.length > 4
              ? ""
              : "* Please input valid leaving date",
        });
        setExperience({
          ...experience,
          leavingDate: leavingDateRef.current.value,
        });
        break;
      case "technologiesWorkedOn":
        setExperienceError({
          ...experienceError,
          technologiesWorkedOn:
            technologiesWorkedOnRef.current.value.length > 6
              ? ""
              : "* Please input complete organization name",
        });
        setExperience({
          ...experience,
          technologiesWorkedOn: technologiesWorkedOnRef.current.value,
        });
        break;
      //end of experience info handler
      case "projectTitle":
        setProjectError({
          ...projectError,
          projectTitle: RegForName.test(projectTitleRef.current.value)
            ? ""
            : "* Please input complete Project Title",
        });
        setProject({ ...project, projectTitle: projectTitleRef.current.value });
        break;
      case "teamSize":
        setProjectError({
          ...projectError,
          teamSize:
            teamSizeRef.current.value.length > 0
              ? ""
              : "* Only Numbers are valid",
        });
        setProject({ ...project, teamSize: teamSizeRef.current.value });
        break;
      case "duration":
        setProjectError({
          ...projectError,
          duration:
            durationRef.current.value.length > 5
              ? ""
              : "*Only support e.g. 20 Days, 1 Month ,1 Year etc.",
        });
        setProject({ ...project, duration: durationRef.current.value });
        break;
      case "techUsed":
        setProjectError({
          ...projectError,
          techUsed:
            techUsedRef.current.value.length > 3
              ? ""
              : "*Only support string e.g. React-Js,JS,node-js etc.",
        });
        setProject({ ...project, techUsed: techUsedRef.current.value });
        break;
      case "descProj":
        setProjectError({
          ...projectError,
          descProj:
            descProjRef.current.value.length > 10
              ? ""
              : "* Please Describe Your Project in Few Words.",
        });
        setProject({ ...project, descProj: descProjRef.current.value });
        break;
      //end of projects info handler
      case "skillName":
        setSkillError({
          ...skillError,
          skillName:
            skillNameRef.current.value.length > 2
              ? ""
              : "* Please Enter valid Skill Name",
        });
        setSkill({ ...skill, skillName: skillNameRef.current.value });
        break;
      case "perfection":
        setSkillError({
          ...skillError,
          perfection:
            perfectionRef.current.value.length < 4
              ? ""
              : "* Please Enter number between 1-100",
        });
        setSkill({ ...skill, perfection: perfectionRef.current.value });
        break;
      //end of skill handler
      case "platformName":
        setSocialError({
          ...socialError,
          platformName:
            platformNameRef.current.value.length > 3
              ? ""
              : "* Please Enter valid Platform Name e.g. LinkedIn,github,twitter etc.",
        });
        setSocial({ ...social, platformName: platformNameRef.current.value });
        break;
      case "platformLink":
        setSocialError({
          ...socialError,
          platformLink:
            platformLinkRef.current.value.length > 15
              ? ""
              : "* Please Enter valid Link",
        });
        setSocial({ ...social, platformLink: platformLinkRef.current.value });
        break;
      //end of social profile handler
      default:
        break;
    }
  };

  //add education data-------------------------------------------------------------------------------------------
  const addEducationInfo = (data) => {
    console.log(data);
    data.id = Math.random();
    let e = {
      degree_name: data.degree_name,
      institute_name: data.institute_name,
      percentage: data.percentage,
      id: data.id,
    };
    if (e.degree_name !== "" && e.institute_name !== "" && e.percentage !== "")
      if (
        educationInfoErrors.degree_name === "" &&
        educationInfoErrors.institute_name === "" &&
        educationInfoErrors.percentage === ""
      ) {
        setEducationDetail((educationDetail) => [...educationDetail, e]);
        setEducationInfoValues({
          ...educationInfoValues,
          isEducationArrayEmpty: false,
        });
        degreeNameRef.current.value = "";
        instituteNameRef.current.value = "";
        percentageRef.current.value = "";
        setEducationInfoValues({
          ...educationInfoValues,
          degree_name: "",
          institute_name: "",
          percentage: "",
          id: "",
        });
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //edit education data
  const handleEditEducation = (data) => {
    console.log(data);
    setEducationInfoValues(data);
    setUpdateButton(true);
  };
  //update education data
  const updateEducationInfo = (data) => {
    console.log(data);
    const index = educationDetail.findIndex(
      (element) => element.id === data.id
    );
    let updateEData = educationDetail;
    if (
      data.degree_name !== "" &&
      data.institute_name !== "" &&
      data.percentage !== ""
    ) {
      if (
        educationInfoErrors.degree_name === "" &&
        educationInfoErrors.institute_name === "" &&
        educationInfoErrors.percentage === ""
      ) {
        updateEData[index] = data;
        degreeNameRef.current.value = "";
        instituteNameRef.current.value = "";
        percentageRef.current.value = "";
        setEducationInfoValues({
          ...educationInfoValues,
          degree_name: "",
          institute_name: "",
          percentage: "",
          id: "",
        });
        setUpdateButton(false);
      } else {
        toast("Validation Error");
      }
    } else {
      toast("All field required");
    }
  };
  //delete education data
  const handleRemoveEducation = (index) => {
    if (window.confirm("Are you sure you want to delete this entry ?")) {
      console.log("btn clicked", index);
      const updateEducationDetail = educationDetail.filter(
        (item) => item.id !== index
      );
      setEducationDetail(updateEducationDetail);
      toast("Entry Deleted");
    } else {
      toast("Operation Cancel");
    }
  };
  //add experience data-------------------------------------------------------------------------------------------
  const addExperienceInfo = (data) => {
    console.log(data);
    data.id = Math.random();
    let e = {
      organizationName: data.organizationName,
      joiningLocation: data.joiningLocation,
      position: data.position,
      ctc: data.ctc,
      joiningDate: data.joiningDate,
      leavingDate: data.leavingDate,
      technologiesWorkedOn: data.technologiesWorkedOn,
      id: data.id,
    };
    console.log(e);
    if (
      e.organizationName !== "" &&
      e.joiningLocation !== "" &&
      e.position !== "" &&
      e.ctc !== "" &&
      e.joiningDate !== "" &&
      e.leavingDate !== "" &&
      e.technologiesWorkedOn !== ""
    )
      if (
        experienceError.organizationName === "" &&
        experienceError.joiningLocation === "" &&
        experienceError.position === "" &&
        experienceError.ctc === "" &&
        experienceError.technologiesWorkedOn === ""
      ) {
        setExperienceDetail((experienceDetail) => [...experienceDetail, e]);
        setExperience({ ...experience, isExperienceArrayEmpty: false });
        organizationNameRef.current.value = "";
        joiningLocationRef.current.value = "";
        positionRef.current.value = "";
        ctcRef.current.value = "";
        joiningDateRef.current.value = "";
        leavingDateRef.current.value = "";
        technologiesWorkedOnRef.current.value = "";
        setExperience({
          ...experience,
          organizationName: "",
          joiningLocation: "",
          position: "",
          ctc: "",
          joiningDate: "",
          leavingDate: "",
          technologiesWorkedOn: "",
          id: "",
        });
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //edit experience data
  const handleEditExperience = (data) => {
    console.log(data);
    setExperience(data);
    setUpdateButton(true);
  };
  //update experience data
  const updateExperienceInfo = (data) => {
    console.log(data);
    const index = experienceDetail.findIndex(
      (element) => element.id === data.id
    );
    let updateEData = experienceDetail;
    if (
      data.organizationName !== "" &&
      data.joiningLocation !== "" &&
      data.position !== "" &&
      data.ctc !== "" &&
      data.joiningDate !== "" &&
      data.leavingDate !== "" &&
      data.technologiesWorkedOn !== ""
    )
      if (
        experienceError.organizationName === "" &&
        experienceError.joiningLocation === "" &&
        experienceError.position === "" &&
        experienceError.ctc === "" &&
        experienceError.technologiesWorkedOn === ""
      ) {
        updateEData[index] = data;
        organizationNameRef.current.value = "";
        joiningLocationRef.current.value = "";
        positionRef.current.value = "";
        ctcRef.current.value = "";
        joiningDateRef.current.value = "";
        leavingDateRef.current.value = "";
        technologiesWorkedOnRef.current.value = "";
        setExperience({
          ...experience,
          organizationName: "",
          joiningLocation: "",
          position: "",
          ctc: "",
          joiningDate: "",
          leavingDate: "",
          technologiesWorkedOn: "",
          id: "",
        });
        setUpdateButton(false);
      } else {
        toast("Validation Error");
      }
    else {
      toast("All field required");
    }
  };
  //delete experience data
  const handleRemoveExperience = (index) => {
    if (window.confirm("Are you sure you want to delete this entry ?")) {
      console.log("btn clicked", index);
      const updateExperienceDetail = experienceDetail.filter(
        (item) => item.id !== index
      );
      setExperienceDetail(updateExperienceDetail);
      toast("Entry Deleted");
    } else {
      toast("Operation Cancel");
    }
  };
  //add projects data-------------------------------------------------------------------------------------------
  const addProjectsInfo = (data) => {
    console.log(data);
    data.id = Math.random();
    let e = {
      projectTitle: data.projectTitle,
      teamSize: data.teamSize,
      duration: data.duration,
      techUsed: data.techUsed,
      descProj: data.descProj,
      id: data.id,
    };
    if (
      e.projectTitle !== "" &&
      e.teamSize !== "" &&
      e.duration !== "" &&
      e.techUsed !== "" &&
      e.descProj !== ""
    )
      if (
        projectError.projectTitle === "" &&
        projectError.teamSize === "" &&
        projectError.duration === "" &&
        projectError.techUsed === "" &&
        projectError.descProj === ""
      ) {
        setProjectDetail((projectDetails) => [...projectDetails, e]);
        setProject({ ...project, isProjectArrayEmpty: false });
        projectTitleRef.current.value = "";
        teamSizeRef.current.value = "";
        durationRef.current.value = "";
        techUsedRef.current.value = "";
        descProjRef.current.value = "";
        setProject({
          ...project,
          projectTitle: "",
          teamSize: "",
          duration: "",
          techUsed: "",
          descProj: "",
          id: "",
        });
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //edit projects data
  const handleEditProject = (data) => {
    console.log(data);
    setProject(data);
    setUpdateButton(true);
  };
  //update projects data
  const updateProjectInfo = (data) => {
    console.log(data);
    const index = projectsDetail.findIndex((element) => element.id === data.id);
    let updatePData = projectsDetail;
    if (
      data.projectTitle !== "" &&
      data.teamSize !== "" &&
      data.duration !== "" &&
      data.techUsed !== "" &&
      data.descProj !== ""
    )
      if (
        projectError.projectTitle === "" &&
        projectError.teamSize === "" &&
        projectError.duration === "" &&
        projectError.techUsed === "" &&
        projectError.descProj === ""
      ) {
        updatePData[index] = data;
        projectTitleRef.current.value = "";
        teamSizeRef.current.value = "";
        durationRef.current.value = "";
        techUsedRef.current.value = "";
        descProjRef.current.value = "";
        setProject({
          ...project,
          projectTitle: "",
          teamSize: "",
          duration: "",
          techUsed: "",
          descProj: "",
          id: "",
        });
        setUpdateButton(false);
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //delete projects data
  const handleRemoveProject = (index) => {
    if (window.confirm("Are you sure you want to delete this entry ?")) {
      console.log("btn clicked", index);
      const updateProjectDetail = projectsDetail.filter(
        (item) => item.id !== index
      );
      setProjectDetail(updateProjectDetail);
      toast("Entry Deleted");
    } else {
      toast("Operation Cancel");
    }
  };
  //add skill data-------------------------------------------------------------------------------------------
  const addSkillInfo = (data) => {
    data.id = Math.random();
    let e = {
      skillName: data.skillName,
      perfection: data.perfection,
      id: data.id,
    };
    if (e.skillName !== "" && e.perfection !== "")
      if (skillError.skillName === "" && skillError.perfection === "") {
        setSkillDetails((skillDetail) => [...skillDetail, e]);
        setSkill({ ...skill, isSkillArrayEmpty: false });
        skillNameRef.current.value = "";
        perfectionRef.current.value = "";
        setSkill({ ...skill, skillName: "", perfection: "", id: "" });
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //edit skill data
  const handleEditSkill = (data) => {
    console.log(data);
    setSkill(data);
    setUpdateButton(true);
  };
  //update skill data
  const updateSkillInfo = (data) => {
    console.log(data);
    const index = skillDetail.findIndex((element) => element.id === data.id);
    let updateSData = skillDetail;
    if (data.skillName !== "" && data.perfection !== "")
      if (skillError.skillName === "" && skillError.perfection === "") {
        updateSData[index] = data;
        skillNameRef.current.value = "";
        perfectionRef.current.value = "";
        setSkill({ ...skill, skillName: "", perfection: "", id: "" });
        setUpdateButton(false);
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //delete skill data
  const handleRemoveSkill = (index) => {
    if (window.confirm("Are you sure you want to delete this entry ?")) {
      console.log("btn clicked", index);
      const updateSkillDetail = skillDetail.filter((item) => item.id !== index);
      setSkillDetails(updateSkillDetail);
      toast("Entry Deleted");
    } else {
      toast("Operation Cancel");
    }
  };
  //add social Profile data-------------------------------------------------------------------------------------------
  const addSocialProfileInfo = (data) => {
    console.log(data);
    data.id = Math.random();
    let e = {
      platformName: data.platformName,
      platformLink: data.platformLink,
      id: data.id,
    };
    if (e.platformName !== "" && e.platformLink !== "")
      if (socialError.platformName === "" && socialError.platformLink === "") {
        setSocialProfileDetails((socialProfileDetail) => [
          ...socialProfileDetail,
          e,
        ]);
        setSocial({ ...social, isPlatformArrayEmpty: false });
        platformNameRef.current.value = "";
        platformLinkRef.current.value = "";
        setSocial({ ...social, platformName: "", platformLink: "", id: "" });
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //edit social Profile data
  const handleEditSocialProfile = (data) => {
    console.log(data);
    setSocial(data);
    setUpdateButton(true);
  };
  //update social Profile data
  const updateSocialProfileInfo = (data) => {
    console.log(data);
    const index = socialProfileDetail.findIndex(
      (element) => element.id === data.id
    );
    let updateSData = socialProfileDetail;
    if (data.platformName !== "" && data.platformLink !== "")
      if (socialError.platformName === "" && socialError.platformLink === "") {
        updateSData[index] = data;
        platformNameRef.current.value = "";
        platformLinkRef.current.value = "";
        setSocial({ ...social, platformName: "", platformLink: "", id: "" });
        setUpdateButton(false);
      } else {
        toast("Validation Error");
      }
    else {
      toast("All Field should be filled");
    }
  };
  //delete social Profile data
  const handleRemoveSocialProfile = (index) => {
    if (window.confirm("Are you sure you want to delete this entry ?")) {
      console.log("btn clicked", index);
      const updateSocialProfileDetail = socialProfileDetail.filter(
        (item) => item.id !== index
      );
      setSocialProfileDetails(updateSocialProfileDetail);
      toast("Entry Deleted");
    } else {
      toast("Operation Cancel");
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Container>
            <Form className="basic_form">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridFname">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    name="fname"
                    value={basicInfoValues.first_name}
                    ref={fnameRef}
                    isValid={basicInfoValues.first_name !== "" ? true : false}
                    isInvalid={
                      basicInfoValuesErrors.first_name !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last Name"
                    name="lname"
                    value={basicInfoValues.last_name}
                    ref={lnameRef}
                    isValid={basicInfoValues.last_name !== "" ? true : false}
                    isInvalid={
                      basicInfoValuesErrors.last_name !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={basicInfoValues.email}
                    ref={emailRef}
                    isValid={basicInfoValues.email !== "" ? true : false}
                    isInvalid={
                      basicInfoValuesErrors.email !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="formGridPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="+91 1234567890"
                  name="phone"
                  value={basicInfoValues.phone}
                  ref={phoneRef}
                  isValid={basicInfoValues.phone !== "" ? true : false}
                  isInvalid={basicInfoValuesErrors.phone !== "" ? true : false}
                  onChange={(e) => handler(e)}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {basicInfoValuesErrors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  placeholder="Apartment, studio, or floor"
                  name="address"
                  value={basicInfoValues.address}
                  ref={addressRef}
                  isValid={basicInfoValues.address !== "" ? true : false}
                  isInvalid={
                    basicInfoValuesErrors.address !== "" ? true : false
                  }
                  onChange={(e) => handler(e)}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {basicInfoValuesErrors.address}
                </Form.Control.Feedback>
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    placeholder="Enter City Name"
                    name="city"
                    value={basicInfoValues.city}
                    ref={cityRef}
                    isValid={basicInfoValues.city !== "" ? true : false}
                    isInvalid={basicInfoValuesErrors.city !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    placeholder="Enter State Name"
                    name="state"
                    value={basicInfoValues.state}
                    ref={stateRef}
                    isValid={basicInfoValues.state !== "" ? true : false}
                    isInvalid={
                      basicInfoValuesErrors.state !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.state}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    placeholder="Enter Pincode"
                    name="pincode"
                    value={basicInfoValues.pincode}
                    ref={pincodeRef}
                    isValid={basicInfoValues.pincode !== "" ? true : false}
                    isInvalid={
                      basicInfoValuesErrors.pincode !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.pincode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group className="mb-3" controlId="exampleForm.Bio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Tell us about yourself"
                    name="bio"
                    value={basicInfoValues.bio}
                    ref={bioRef}
                    isValid={basicInfoValues.bio !== "" ? true : false}
                    isInvalid={basicInfoValuesErrors.bio !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {basicInfoValuesErrors.bio}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
          </Container>
        );
      case 1:
        return (
          <Container>
            <Form className="basic_form">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridDegreeName">
                  <Form.Label>Degree Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Degree Name"
                    name="degree_name"
                    ref={degreeNameRef}
                    value={educationInfoValues.degree_name}
                    isValid={
                      educationInfoValues.degree_name !== "" ? true : false
                    }
                    isInvalid={
                      educationInfoErrors.degree_name !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {educationInfoErrors.degree_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridInstituteName">
                  <Form.Label>Institute Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Institute Name"
                    name="institute_name"
                    value={educationInfoValues.institute_name}
                    ref={instituteNameRef}
                    isValid={
                      educationInfoValues.institute_name !== "" ? true : false
                    }
                    isInvalid={
                      educationInfoErrors.institute_name !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {educationInfoErrors.institute_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPercentage">
                  <Form.Label>Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Percentage"
                    name="percentage"
                    value={educationInfoValues.percentage}
                    ref={percentageRef}
                    isValid={
                      educationInfoValues.percentage !== "" ? true : false
                    }
                    isInvalid={
                      educationInfoErrors.percentage !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {educationInfoErrors.percentage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              {update ? (
                <>
                  <div className="text-center">
                    <Button
                      onClick={() => updateEducationInfo(educationInfoValues)}
                      variant="contained"
                      color="info"
                    >
                      Update
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <Button
                      onClick={() => addEducationInfo(educationInfoValues)}
                      variant="contained"
                      color="success"
                    >
                      Add
                    </Button>
                  </div>
                </>
              )}
            </Form>
            {educationDetail.length > 0 ? (
              <>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Degree Name</th>
                      <th>Institute Name</th>
                      <th>Percentage</th>
                      <th colSpan={2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationDetail.map((data, i) => (
                      <tr key={i}>
                        <td>{data.degree_name}</td>
                        <td>{data.institute_name}</td>
                        <td>{data.percentage}</td>
                        <td>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleEditEducation(data)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveEducation(data.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <BsPlus /> &nbsp; Add Education Detail
              </>
            )}
            <br />
          </Container>
        );
      case 2:
        return (
          <Container>
            <Form className="basic_form">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridOrganizationName">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Organization Name"
                    name="organizationName"
                    value={experience.organizationName}
                    ref={organizationNameRef}
                    isValid={experience.organizationName !== "" ? true : false}
                    isInvalid={
                      experienceError.organizationName !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {experienceError.organizationName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridJoiningLocation">
                  <Form.Label>Joining Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Joining Location"
                    name="joiningLocation"
                    value={experience.joiningLocation}
                    ref={joiningLocationRef}
                    isValid={experience.joiningLocation !== "" ? true : false}
                    isInvalid={
                      experienceError.joiningLocation !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {experienceError.joiningLocation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Form.Group as={Col} controlId="formGridPosition">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Position"
                  name="position"
                  value={experience.position}
                  ref={positionRef}
                  isValid={experience.position !== "" ? true : false}
                  isInvalid={experienceError.position !== "" ? true : false}
                  onChange={(e) => handler(e)}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {experienceError.position}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGridCTC">
                <Form.Label>CTC</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter CTC"
                  name="ctc"
                  value={experience.ctc}
                  ref={ctcRef}
                  isValid={experience.ctc !== "" ? true : false}
                  isInvalid={experienceError.ctc !== "" ? true : false}
                  onChange={(e) => handler(e)}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {experienceError.ctc}
                </Form.Control.Feedback>
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridJoiningDate">
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter Joining Date"
                    name="joiningDate"
                    value={experience.joiningDate}
                    ref={joiningDateRef}
                    isValid={experience.joiningDate !== "" ? true : false}
                    isInvalid={
                      experienceError.joiningDate !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {experienceError.joiningDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLeavingDate">
                  <Form.Label>Leaving Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter Leaving Date"
                    name="leavingDate"
                    value={experience.leavingDate}
                    ref={leavingDateRef}
                    isValid={experience.leavingDate !== "" ? true : false}
                    isInvalid={
                      experienceError.leavingDate !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {experienceError.leavingDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Technologies worked on</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="List of Technologies Worked on"
                    name="technologiesWorkedOn"
                    value={experience.technologiesWorkedOn}
                    ref={technologiesWorkedOnRef}
                    isValid={
                      experience.technologiesWorkedOn !== "" ? true : false
                    }
                    isInvalid={
                      experienceError.technologiesWorkedOn !== "" ? true : false
                    }
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {experienceError.technologiesWorkedOn}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
            {update ? (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => updateExperienceInfo(experience)}
                    variant="contained"
                    color="info"
                  >
                    Update
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => addExperienceInfo(experience)}
                    variant="contained"
                    color="success"
                  >
                    Add
                  </Button>
                </div>
              </>
            )}
            <br />
            {experienceDetail.length > 0 ? (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Org.Name</th>
                      <th>Joining Location</th>
                      <th>Position</th>
                      <th>CTC</th>
                      <th>Joining Date</th>
                      <th>Leaving Date</th>
                      <th>Technologies Used</th>
                      <th colSpan={2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experienceDetail.map((data, i) => (
                      <tr key={i}>
                        <td>{data.organizationName}</td>
                        <td>{data.joiningLocation}</td>
                        <td>{data.position}</td>
                        <td>{data.ctc}</td>
                        <td>{data.joiningDate}</td>
                        <td>{data.leavingDate}</td>
                        <td>{data.technologiesWorkedOn}</td>

                        <td>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleEditExperience(data)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveExperience(data.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <BsPlus /> &nbsp; Add Experience Detail
              </>
            )}
            <br />
          </Container>
        );
      case 3:
        return (
          <Container>
            <Form className="basic_form">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridProjectTitle">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Project Title"
                    name="projectTitle"
                    value={project.projectTitle}
                    ref={projectTitleRef}
                    isValid={project.projectTitle !== "" ? true : false}
                    isInvalid={projectError.projectTitle !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {projectError.projectTitle}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridTeamSize">
                  <Form.Label>Team Size</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Team Size"
                    name="teamSize"
                    value={project.teamSize}
                    ref={teamSizeRef}
                    isValid={project.teamSize !== "" ? true : false}
                    isInvalid={projectError.teamSize !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {projectError.teamSize}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridDuration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Duration"
                    name="duration"
                    value={project.duration}
                    ref={durationRef}
                    isValid={project.duration !== "" ? true : false}
                    isInvalid={projectError.duration !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {projectError.duration}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTechnologiesWorkedOn"
                >
                  <Form.Label>Technologies worked on</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="List of Technologies Worked on"
                    name="techUsed"
                    value={project.techUsed}
                    ref={techUsedRef}
                    isValid={project.techUsed !== "" ? true : false}
                    isInvalid={projectError.techUsed !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {projectError.techUsed}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.Description"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Project Description"
                    name="descProj"
                    value={project.descProj}
                    ref={descProjRef}
                    isValid={project.descProj !== "" ? true : false}
                    isInvalid={projectError.descProj !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {projectError.descProj}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
            {update ? (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => updateProjectInfo(project)}
                    variant="contained"
                    color="info"
                  >
                    Update
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => addProjectsInfo(project)}
                    variant="contained"
                    color="success"
                  >
                    Add
                  </Button>
                </div>
              </>
            )}
            <br />
            {projectsDetail.length > 0 ? (
              <>
                <Table striped bordered hover size="sm" responsive="xl">
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Team Size</th>
                      <th>Duration</th>
                      <th>List of Tech</th>
                      <th>Description</th>
                      <th colSpan={2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsDetail.map((data, i) => (
                      <tr key={i}>
                        <td>{data.projectTitle}</td>
                        <td>{data.teamSize}</td>
                        <td>{data.duration}</td>
                        <td>{data.techUsed}</td>
                        <td>{data.descProj}</td>
                        <td>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleEditProject(data)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveProject(data.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <BsPlus /> &nbsp; Add Project Detail
              </>
            )}
            <br />
          </Container>
        );
      case 4:
        return (
          <Container>
            <Form className="basic_form">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridSkillName">
                  <Form.Label>Skill Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Skill"
                    name="skillName"
                    value={skill.skillName}
                    ref={skillNameRef}
                    isValid={skill.skillName !== "" ? true : false}
                    isInvalid={skillError.skillName !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {skillError.skillName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPerfection">
                  <Form.Label>Perfection(%)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Perfection Number like 70,80 etc"
                    name="perfection"
                    value={skill.perfection}
                    ref={perfectionRef}
                    isValid={skill.perfection !== "" ? true : false}
                    isInvalid={skillError.perfection !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {skillError.perfection}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
            {update ? (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => updateSkillInfo(skill)}
                    variant="contained"
                    color="info"
                  >
                    Update
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => addSkillInfo(skill)}
                    variant="contained"
                    color="success"
                  >
                    Add
                  </Button>
                </div>
              </>
            )}
            <br />
            {skillDetail.length > 0 ? (
              <>
                <Table striped bordered hover size="sm" responsive="sm">
                  <thead>
                    <tr>
                      <th>Skill Name</th>
                      <th>Perfection</th>
                      <th colSpan={2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillDetail.map((data, i) => (
                      <tr key={i}>
                        <td>{data.skillName}</td>
                        <td>{data.perfection}</td>
                        <td>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleEditSkill(data)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveSkill(data.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <BsPlus /> &nbsp; Add Skill Detail
              </>
            )}
            <br />
          </Container>
        );
      case 5:
        return (
          <Container>
            <Form className="basic_form">
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPlatformName">
                  <Form.Label>Platform Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Platform Name e.g. LinkedIn,Twitter etc"
                    name="platformName"
                    value={social.platformName}
                    ref={platformNameRef}
                    isValid={social.platformName !== "" ? true : false}
                    isInvalid={socialError.platformName !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {socialError.platformName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPerfection">
                  <Form.Label>Profile Link</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Paste Social Profile Link"
                    name="platformLink"
                    value={social.platformLink}
                    ref={platformLinkRef}
                    isValid={social.platformLink !== "" ? true : false}
                    isInvalid={socialError.platformLink !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {socialError.platformLink}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
            {update ? (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => updateSocialProfileInfo(social)}
                    variant="contained"
                    color="info"
                  >
                    Update
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => addSocialProfileInfo(social)}
                    variant="contained"
                    color="success"
                  >
                    Add
                  </Button>
                </div>
              </>
            )}
            <br />
            {socialProfileDetail.length > 0 ? (
              <>
                <Table striped bordered hover size="sm" responsive="sm">
                  <thead>
                    <tr>
                      <th>Platform Name</th>
                      <th>Platform Link</th>
                      <th colSpan={2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socialProfileDetail.map((data, i) => (
                      <tr key={i}>
                        <td>{data.platformName}</td>
                        <td>{data.platformLink}</td>
                        <td>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleEditSocialProfile(data)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveSocialProfile(data.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <>
                <BsPlus /> &nbsp; Add Social Profile Detail
              </>
            )}
            <br />
          </Container>
        );
      default:
        return "Unknown step";
    }
  }

  const editPdf = (cvData) => {
    setEdit(true);
    setCvId(cvData.pdfNumber);
    setBasicInfoValues({
      ...basicInfoValues,
      first_name: cvData.profile.first_name,
      last_name: cvData.profile.last_name,
      email: cvData.profile.email,
      phone: cvData.profile.phone,
      address: cvData.profile.address,
      city: cvData.profile.city,
      state: cvData.profile.state,
      pincode: cvData.profile.pincode,
      bio: cvData.profile.bio,
    });
    setEducationDetail(cvData.education);
    setExperienceDetail(cvData.experience);
    setProjectDetail(cvData.project);
    setSkillDetails(cvData.skill);
    setSocialProfileDetails(cvData.socialProfile);
  };

  return (
    <>
      {edit ? (
        <>
          <Container>
            <Row className="editor_row_section">
              <Col xl={6} sm={12} md={6} className="editor_col_section">
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>
                      <StepContent>
                        {getStepContent(index)}
                        <div>
                          <div className="prev_nxt_btn">
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={activeStep === 0}
                              onClick={handleBack}
                            >
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleNext}
                            >
                              {activeStep === steps.length - 1
                                ? "Finish"
                                : "Next"}
                            </Button>
                          </div>
                        </div>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                <br />
                {activeStep === steps.length && (
                  <Paper square elevation={0}>
                    <Typography>One more Click to go !</Typography>
                    <Button
                      onClick={upDateCv}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                  </Paper>
                )}
              </Col>
              <Col xl={6} sm={12} md={6}>
                <Layout
                  profile={{
                    basic: basicInfoValues,
                    education: educationDetail,
                    experience: experienceDetail,
                    project: projectsDetail,
                    skill: skillDetail,
                    socialProfile: socialProfileDetail,
                    download: download,
                  }}
                />
              </Col>
            </Row>
          </Container>
          <div className="text-center mt-5"></div>
        </>
      ) : (
        <>
          <Container className="border border-secondary">
            {!pdfIsEmpty ? (
              <>
                <div>
                  <h2 className="text-center">CV Created by You</h2>
                </div>
                <br />
                {pdf.map((cvData, i) => (
                  <Accordion key={i}>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        CV Number : {i + 1} <br /> &nbsp;{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                        <Container>
                          <div>
                            <div className="edit_del_btn">
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => editPdf(cvData)}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                          <Layout
                            profile={{
                              basic: cvData.profile,
                              education: cvData.education,
                              experience: cvData.experience,
                              project: cvData.project,
                              skill: cvData.skill,
                              socialProfile: cvData.socialProfile,
                              download: download,
                            }}
                          />
                        </Container>
                        <br />
                        <div className="text-center"></div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                ))}
              </>
            ) : (
              <>
                <h2 className="text-center">No CV Found</h2>
              </>
            )}
            <hr />
            <br />
          </Container>
        </>
      )}
    </>
  );
}

export default EditCv;
