import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = lazy(() => import("./components/common_components/Header"));
const Login = lazy(() => import("./components/login_and_register/Login"));
const Register = lazy(() => import("./components/login_and_register/Register"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Editor = lazy(() => import("./components/editor/Editor"));
const EditCv = lazy(() => import("./components/EditCv"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const ForgetPassword = lazy(() =>
  import("./components/login_and_register/ForgetPassword")
);
const ResetPassword = lazy(() =>
  import("./components/login_and_register/ResetPassword")
);
const VerifyEmail = lazy(() =>
  import("./components/login_and_register/VerifyEmail")
);

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="container text-center text-danger">
            <h1>Loading....</h1>
          </div>
        }
      >
        <Router>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggableDirection="true"
            pauseOnFocusLoss
            draggable
          />
          <Header />
          <Routes>
            <Route path="/" exact element={<Login />}></Route>
            <Route path="/register" exact element={<Register />}></Route>
            <Route path="/dashboard" exact element={<Dashboard />}></Route>
            <Route path="/verify_email" exact element={<VerifyEmail />} />
            <Route path="/forgetpassword" exact element={<ForgetPassword />} />
            <Route path="/resetpassword" exact element={<ResetPassword />} />
            <Route path="/create_cv" exact element={<Editor />} />
            <Route path="/edit" exact element={<EditCv />} />
            <Route path="*" exact element={<PageNotFound />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  );
}

export default App;
