import React, { Component } from "react";

import "../styles/book.css";

import eg_icon from "../images/book_eg_icon@2x.png";

export class SingleBook extends Component {
  render() {
    const { book } = this.props;
    console.log(book);

    return (
      <div className="book-single-container">
        <img src={book.bookCover} alt="" className="book-img" />
        <h3 className="book-title">
          Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad
          Ones
        </h3>
        <button className="book-button">Add to Cart</button>
      </div>
    );
  }
}

export default SingleBook;
