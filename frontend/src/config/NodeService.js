import axios from "axios";
import { MAIN_URL } from "./Url";

let token = localStorage.getItem("token");
let email = localStorage.getItem("email");

//register user
export function registerUser(data) {
  return axios.post(`${MAIN_URL}register`, data);
}

//login user
export function loginUser(data) {
  return axios.post(`${MAIN_URL}login`, data);
}
//verify email
export function verifyEmail(data) {
  console.log(data);
  return axios.post(`${MAIN_URL}email_Verification/${email}`, data);
}

//get state for verified email
export function getVerifyEmailState() {
  return axios.get(`${MAIN_URL}verifyState/${email}`);
}

//resend email verification mail
export function resend_VerifyEmail(data) {
  console.log(data);
  return axios.post(`${MAIN_URL}email_Verification`, data);
}

//forget password
export function forgetPassword(data) {
  return axios.post(`${MAIN_URL}forgetpassword`, data);
}

//reset password
export function resetPassword(data) {
  return axios.put(`${MAIN_URL}resetpassword`, data);
}

//get customer info
export function getCustomer(uid) {
  console.log(uid);
  return axios.get(`${MAIN_URL}getCustomerProfile/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//updateProfileImage
export function updateProfileImage(formdata, config) {
  console.log(formdata, config);
  return axios.put(`${MAIN_URL}propic`, formdata, config);
}
//add order or place order
export function addToPdfSchema(uid, data) {
  console.log(uid);
  console.log(data);
  return axios.post(`${MAIN_URL}addDataToPdf/${uid}`, data);
}
//fetch or get order details
export function getAllPdf(uid) {
  return axios.get(`${MAIN_URL}getPdfDetails/${uid}`);
}
//edit CV
export function editCV(data) {
  console.log(data);
  return axios.put(`${MAIN_URL}editCv`, data);
}
