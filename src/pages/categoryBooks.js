import React, { Component } from "react";

import Banner from "../components/Banner";
import Categories from "../components/Categories";
import BooksList from "../components/BooksList";
import BottomReview from "../components/BottomReview";

import "../styles/home.css";

export class categoryBooks extends Component {
  render() {
    return (
      <div className="home-main-container">
        <h1 className="home-title">Category</h1>
        <BooksList />
      </div>
    );
  }
}

export default categoryBooks;
