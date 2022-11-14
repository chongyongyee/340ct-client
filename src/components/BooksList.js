import React, { Component } from "react";

import SingleBook from "./SingleBook";

import "../styles/book.css";
import book from "../pages/book";

export class BooksList extends Component {
  render() {
    const { books } = this.props;

    return <div className="book-main-container"></div>;
  }
}

export default BooksList;
