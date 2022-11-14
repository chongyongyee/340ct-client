import axios from "axios";
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
} from "../types";

export const loginUser = (userData, navigate) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.idToken);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      navigate("/");
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        dispatch({
          type: SET_ERRORS,
          payload: error.response.data,
        });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: error.response,
        });
      }
      console.error(error.response);
    });
};

export const signupUser = (newUserData, navigate) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.idToken);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      navigate("/");
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        dispatch({
          type: SET_ERRORS,
          payload: error.response.data,
        });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: error.response,
        });
      }
      console.error(error.response);
    });
};

export const getUserData = () => (dispatch) => {
  axios
    .post("/user-data")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        dispatch({
          type: SET_ERRORS,
          payload: error.response.data,
        });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: error.response,
        });
      }
      console.error(error.response);
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({
    type: SET_UNAUTHENTICATED,
  });
  window.location.href = "/login";
};

export const setAuthorizationHeader = (idToken) => {
  const FBIdToken = `Bearer ${idToken}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const handleUnauthorised = (error) => (dispatch) => {
  if (
    error.response &&
    error.response.status &&
    error.response.status === 403
  ) {
    console.log("handled unauthorized action");
    dispatch(logoutUser());
  }
};
