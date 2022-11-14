import { SET_BOOKS, CLEAR_BOOKS, SET_BOOK, CLEAR_BOOK } from "../types";

const initialState = {
  books: [],
  singleBook: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_BOOKS:
      return {
        ...state,
        books: action.payload,
        loading: false,
      };
    case CLEAR_BOOKS:
      return {
        ...state,
        books: [],
        loading: false,
      };
    case SET_BOOK:
      return {
        ...state,
        singleBook: action.payload,
        loading: false,
      };
    case CLEAR_BOOK:
      return {
        ...state,
        singleBook: {},
        loading: false,
      };
    default:
      return state;
  }
}
