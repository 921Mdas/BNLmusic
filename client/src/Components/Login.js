// External Imports
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { gapi } from "gapi-script";
import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import { Formik } from "formik";
import * as Yup from "yup";

// icons
import { HiOutlineMail, HiOutlineKey } from "react-icons/hi";
import { GiDrum } from "react-icons/gi";
import { RiErrorWarningLine } from "react-icons/ri";
import { FcApproval } from "react-icons/fc";
import { MdHorizontalRule } from "react-icons/md";
import { MdPassword } from "react-icons/md";

// Internal imports
import { MyContext } from "../Context/index.context";
import jazz from "../videos/pexels-anthony-shkraba-production-8043616.mp4";
import { GoogleOAuthLogin } from "./OAuth";
import InputCtrl from "./Artists/InputCtrl";
import {
  UserAuthentication,
  ToasterError,
  ToasterSuccess,
  EmailRegex,
  PasswordRegex,
  getStorage,
  setStorage,
} from "../Context/helper";

const GOOGLE_CLIENT_ID =
  "772173664744-m0eu6jh0ijf2ivbb1hvdi1lvt6mlai5u.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";

function Login() {
  const { dispatch, COMMANDS } = useContext(MyContext);
  const handleGoogleLogout = () => {
    console.log("logout");
  };

  const HandleGoogleLogin = async googleData => {
    if (googleData.tokenId) {
      dispatch({ type: COMMANDS.GOOGLE_LOGIN, payload: googleData });
    }

    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    setStorage("loginData", data);
  };

  const HandleGoogleFailure = result => {
    console.log("fail", result);
  };

  let navigate = useNavigate();

  const [localUser, setlocalUser] = useState({
    email: "",
    password: "",
  });
  const [validateEmail, setValidateEmail] = useState("");
  const [validatePass, setValidatePass] = useState("");
  const [register, setRegister] = useState(false);

  // session stored, userdata, token
  let getLoginData = getStorage("userLoginData");
  let createLoginData;

  //  load storage login userData
  useEffect(() => {
    if (!getLoginData) return;
    dispatch({ type: COMMANDS.UPDATE_USERONLINE, payload: getLoginData });
  }, [createLoginData]);

  // sign in
  const handleSignIn = async data => {
    try {
      // e.preventDefault();
      const SignedUser = await UserAuthentication(`user/userlogin`, data);
      // manual sign in
      if (SignedUser?.data.isAuth) {
        createLoginData = setStorage("userLoginData", SignedUser);
        dispatch({ type: COMMANDS.LOGGEDIN, payload: SignedUser });
        ToasterSuccess(`welcome ${SignedUser?.data.user.email}`);
        navigate("/home");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error) console.log(error.message);
    }
  };

  // sign up
  const handleSignUp = async data => {
    try {
      // e.preventDefault();
      const RegisteredUser = await UserAuthentication(`user/register`, data);
      setRegister(false);
      ToasterSuccess(`Success ${RegisteredUser.data.email}`);
    } catch (error) {
      if (error) ToasterError(error.response.data);
      console.log(error);
    }
  };

  const handleManualChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setlocalUser({ ...localUser, [name]: value });

    const emailTest = EmailRegex.test(localUser.email);
    const passwordTest = PasswordRegex.test(localUser.password);

    if (emailTest) {
      setValidateEmail(true);
    } else {
      setValidateEmail(false);
    }

    if (passwordTest) {
      setValidatePass(true);
    } else {
      setValidatePass(false);
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validate = Yup.object({
    email: Yup.string().required("please enter email"),
    password: Yup.string().required("please enter password"),
  });

  return (
    <div className="loginpage">
      <div className="bgc-vid">
        <video
          src={jazz}
          autoPlay={true}
          loop={true}
          className="videobg"
        ></video>
      </div>

      <div className="sign_inpageContent"></div>
      <div className="sign_in_form">
        <div className="loginTitle">
          <div className="titles">
            <GiDrum className="logoIcon" />
            <h1>Welcome Back</h1>
            <h4>
              Log in to <span>BanaLeo</span>{" "}
            </h4>
          </div>
          <div className="sign_in">
            <div className="google">
              <GoogleLogin
                className="loginBtn"
                clientId={GOOGLE_CLIENT_ID}
                buttonText="GOOGLE LOGIN "
                onSuccess={googleData => {
                  navigate("/home");
                  HandleGoogleLogin(googleData);
                }}
                onFailure={HandleGoogleFailure}
                cookiePolicy={"single_host_origin"}
                isSignedIn={true}
              ></GoogleLogin>
              {/* <GoogleOAuthLogin
                className="loginBtn"
                clientID={process.env.REACT_GOOGLE_CLIENTID}
              /> */}
            </div>
            <div className="alternative">
              <MdHorizontalRule className="line" /> OR{" "}
              <MdHorizontalRule className="line" />
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={(values, { resetForm }) => {
                register ? handleSignUp(values) : handleSignIn(values);
              }}
            >
              {({
                values,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                errors,
              }) => {
                return (
                  <div className="logindiv Signinform">
                    <InputCtrl
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      placeholder="Enter name *"
                      inputName="email"
                      Icon={HiOutlineMail}
                      InputType="text"
                      valueType={values.email}
                      errors={errors}
                      touched={touched}
                      id="logininput"
                    />
                    ;
                    <InputCtrl
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      placeholder="Enter password *"
                      inputName="password"
                      Icon={MdPassword}
                      InputType="text"
                      valueType={values.password}
                      errors={errors}
                      touched={touched}
                    />
                    ;
                    {register ? (
                      <Button
                        type="submit"
                        className="signinBtn"
                        onClick={e => handleSubmit()}
                      >
                        Sign up
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="signinBtn"
                        onClick={e => handleSubmit()}
                      >
                        Sign in
                      </Button>
                    )}
                    <Button
                      variant="light"
                      onClick={() => setRegister(!register)}
                    >
                      {register
                        ? "Want to Login ?"
                        : "Want to create account ?"}
                    </Button>
                  </div>
                );
              }}
            </Formik>
            {/* 
            <Form action="" className="Signinform">
              <div className="inputController">
                {!validateEmail ? (
                  <RiErrorWarningLine className="success notif" />
                ) : (
                  <FcApproval className="failure notif" />
                )}

                <HiOutlineMail className="iconplaceholder mail" />
                <Form.Control
                  name="email"
                  type="text"
                  className="inputfield"
                  onChange={e => handleManualChange(e)}
                />
              </div>
              <div className="inputController">
                {!validatePass ? (
                  <RiErrorWarningLine className="success notif" />
                ) : (
                  <FcApproval className="failure notif" />
                )}
                <HiOutlineKey className="iconplaceholder key" />
                <Form.Control
                  name="password"
                  type="password"
                  className="inputfield"
                  onChange={e => handleManualChange(e)}
                />
              </div>
              {register ? (
                <Button
                  type="submit"
                  className="signinBtn"
                  onClick={e => handleSignUp(e)}
                >
                  Sign up
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="signinBtn"
                  onClick={e => handleSignIn(e)}
                >
                  Sign in
                </Button>
              )}
              <Button variant="light" onClick={() => setRegister(!register)}>
                {register ? "Want to Login ?" : "Want to create account ?"}
              </Button>
            </Form> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
