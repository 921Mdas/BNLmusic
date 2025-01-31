// External Imports
import React, { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { RiErrorWarningLine } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlinePicture } from "react-icons/ai";
import { BiText } from "react-icons/bi";
import { GrFlag } from "react-icons/gr";
import { GiWorld } from "react-icons/gi";
import { BsCalendar2Date } from "react-icons/bs";
import { BsPersonLinesFill } from "react-icons/bs";
import { IoMusicalNote } from "react-icons/io5";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

// Internal Imports
import InputCtrl from "./InputCtrl";
import SubmitBtn from "./SubmitBtn";
import Goback from "../UtilComponent/Goback";
import { ToasterSuccess, ToasterError } from "../../Context/helper";
import { NavigateSomewhere } from "../../Context/helper";

const MusicianForm = ({
  dispatch,
  COMMANDS,
  addArtistForm,
  state,
  MoveBack,
  updateArtist,
  updateArtistForm,
  registerArtist,
}) => {
  const handleChangingForm = e => {
    let inputname = e.target.name;
    let inputvalue = e.target.value;

    console.log("analysing input ctrl", inputname, inputvalue);
    if (!inputname || !inputvalue) return;
    dispatch({
      type: COMMANDS.SET_ARTISTS,
      payload: { inputname, inputvalue },
    });
  };

  const handleUpdateArtist = async () => {
    await updateArtistForm();
  };

  const defaultValues = {
    name: state.name,
    picture: state.picture,
    song: state.song,
    country: state.country,
    year: state.year,
    bio: state.bio,
  };

  const validation = Yup.object({
    name: Yup.string().required("enter name"),
    picture: Yup.string().required("include picture URL"),
    song: Yup.string(),
    country: Yup.string().required("Nationality ?"),
    year: Yup.string(),
    bio: Yup.string(),
  });

  return (
    <div className="App-header-form">
      <Formik
        initialValues={defaultValues}
        validationSchema={validation}
        onSubmit={async (values, { resetForm }) => {
          dispatch({
            type: COMMANDS.CREATE_NEW_ARTISTS,
            payload: values,
          });
          const { name, picture, song, bio, country, year } = values;
          await registerArtist({ name, picture, song, bio, country, year });
          MoveBack("/home");
        }}
      >
        {({
          values,
          handleBlur,
          handleSubmit,
          handleChange,
          errors,
          touched,
          isSubmitting,
        }) => (
          <div className="musician_form_inputctrl">
            <InputCtrl
              handleChange={handleChange}
              handleBlur={handleBlur}
              placeholder="Enter name *"
              inputName="name"
              Icon={BsPerson}
              InputType="text"
              valueType={values.name}
              errors={errors}
              touched={touched}
              className="input_ctrl_musician"
            />
            <InputCtrl
              handleChange={handleChange}
              handleBlur={handleBlur}
              placeholder="Enter country"
              inputName="country"
              Icon={GiWorld}
              InputType="text"
              errors={errors}
              touched={touched}
              className="input_ctrl_musician"
            />
            <InputCtrl
              handleChange={handleChange}
              handleBlur={handleBlur}
              placeholder="Enter picture URL *"
              inputName="picture"
              Icon={AiOutlinePicture}
              InputType="text"
              errors={errors}
              touched={touched}
              className="input_ctrl_musician"
            />
            <div className="song_details_form">
              <InputCtrl
                handleChange={handleChange}
                handleBlur={handleBlur}
                placeholder="Enter Hit Title"
                inputName="song"
                Icon={IoMusicalNote}
                InputType="text"
                errors={errors}
                touched={touched}
                className="input_ctrl_musician"
              />
              <InputCtrl
                handleChange={handleChange}
                handleBlur={handleBlur}
                placeholder="Enter Hit Year"
                inputName="year"
                Icon={BsCalendar2Date}
                InputType="number"
                errors={errors}
                touched={touched}
                className="input_ctrl_musician"
              />
            </div>
            <InputCtrl
              handleChange={handleChange}
              handleBlur={handleBlur}
              placeholder="Enter bio"
              inputName="bio"
              Icon={BsPersonLinesFill}
              InputType="textarea"
              errors={errors}
              touched={touched}
              className="input_ctrl_musician"
            />
            <div className="submit_actions_musicianform">
              <Link to="/home">
                <Button
                  className="cancel canceL_musicianform"
                  onClick={() => NavigateSomewhere("/home")}
                >
                  Cancel
                </Button>
              </Link>
              <SubmitBtn
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default MusicianForm;
