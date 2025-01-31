// External Imports
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import colormap from "colormap";
import { math, random } from "canvas-sketch-util";

// Internal Imports

// reset item data on local storage
export const resetStorage = (itemName, newData) => {
  if (localStorage.getItem(itemName)) {
    localStorage.removeItem(itemName);
  }
  localStorage.setItem(itemName, JSON.stringify(newData));
};
// get new item on local storage
export const getStorage = itemName => {
  const isInLocalStorage = localStorage.getItem(itemName)
    ? JSON.parse(localStorage.getItem(itemName))
    : null;

  return isInLocalStorage;
};

export const setStorage = (itemName, item) => {
  const setInLocalStorage = item
    ? localStorage.setItem(itemName, JSON.stringify(item))
    : null;

  return setInLocalStorage;
};
// logout

export const LogOut = dataType => {
  localStorage.removeItem(dataType);
  localStorage.clear();
};
// create toaster - !problematic to be reviewed
export const ToasterError = message => {
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 500,
  });
};
export const ToasterSuccess = message => {
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 500,
  });
};

// loading spinner
export const Load = (type, color) => {
  return (
    <div className="spinner">
      <Spinner animation={type} variant={color} size="lg" />
    </div>
  );
};
// navigate to a specific directions
export const NavigateSomewhere = direction => {
  const navigate = useNavigate();

  return direction => {
    navigate(direction);
  };
};
// user authentication
export const UserAuthentication = async (url, currentUser) => {
  try {
    const loggedUser = await axios.post(url, currentUser);
    return loggedUser;
  } catch (error) {
    if (error) ToasterError(error.response.data);
    console.log(error);
  }
};

// email and password regex
export const EmailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "g"
);
export const PasswordRegex = new RegExp(/[0-9]/, "g");

// date creator
export let dateCreator = (data, val) => {
  if (data)
    return (
      new Date(data[val]).getDay().toString() +
      "-" +
      (new Date(data[val]).getMonth() + 1).toString() +
      "-" +
      new Date(data[val]).getFullYear().toString()
    );
};

// counter

export let COUNTER = ({ end, children }) => {
  const [start, setStart] = useState(0);
  const counter = () => {
    if (start < end) {
      setStart(prevcount => prevcount + 1);
    }
  };

  useEffect(() => {
    if (start > 0 && start < end) {
      setTimeout(() => {
        setStart(prevcount => prevcount + 1);
      }, 30);
    }
  }, [start]);

  return (
    <>
      <Fade
        onVisibilityChange={inView => {
          if (inView) {
            counter();
          }
        }}
      >
        <span>{start}</span>
      </Fade>
    </>
  );
};

// colorpick

export const COLORPICKER = shades => {
  const colors = colormap({
    colormap: "magma",
    nshades: shades,
  });

  return colors;
};
