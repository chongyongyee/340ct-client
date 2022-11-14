import {
  SET_BOOKS,
  CLEAR_BOOKS,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_BOOK,
} from "../types";
import { LOADING_UI } from "../types";

import axios from "axios";

export const setBooks = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get("/stock")
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: SET_BOOKS,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
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

export const setBook = (book) => (dispatch) => {
  axios
    .post("/get-book", book)
    .then((res) => {
      dispatch({
        type: SET_BOOK,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
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
