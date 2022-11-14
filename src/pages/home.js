import React, { Component } from "react";

import Banner from "../components/Banner";
import Categories from "../components/Categories";
import BooksList from "../components/BooksList";
import BottomReview from "../components/BottomReview";
import SingleBook from "../components/SingleBook";

import jwtDecode from "jwt-decode";

import { withRouter } from "../util/withRouter";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setBooks } from "../redux/actions/dataActions";

import axios from "axios";

import "../styles/home.css";
import book from "./book";

export class home extends Component {
  state = {
    books: [],
    errors: null,
    loading: false,
    username: "",
    userType: "",
  };

  componentDidMount() {
    localStorage.removeItem("currentBook");
    localStorage.removeItem("username");
    localStorage.removeItem("userType");
    this.setState({
      loading: true,
    });
    axios
      .get("/stock")
      .then((res) => {
        this.setState({
          loading: false,
          books: res.data,
          errors: null,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({
            loading: false,
            errors: error.response.data,
          });
        } else {
          this.setState({
            loading: false,
            errors: error.response,
          });
        }
        console.error(error.response);
      });

    axios
      .post("/user-data")
      .then((res) => {
        this.setState({
          username: res.data.credentials.username,
          userType: res.data.credentials.userType,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({
            loading: false,
            errors: error.response.data,
          });
        } else {
          this.setState({
            loading: false,
            errors: error.response,
          });
        }
        console.error(error.response);
      });
  }

  submitAddToCart = (bookID) => {
    const token = localStorage.FBIdToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        this.props.navigate("/");
      }
    } else {
      this.props.navigate("/");
    }

    this.setState({
      loading: true,
    });

    const newCart = {
      username: this.state.username,
      bookID: bookID,
    };
    axios
      .post("/cart", newCart)
      .then((res) => {
        window.alert("Added to cart successfully");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({
            loading: false,
            errors: error.response.data,
          });
        } else {
          this.setState({
            loading: false,
            errors: error.response,
          });
        }
        console.error(error.response);
      });
  };

  goToBook = (bookID) => {
    localStorage.setItem("currentBook", bookID);
    localStorage.setItem("username", this.state.username);
    localStorage.setItem("userType", this.state.userType);
    this.props.navigate("/book");
  };

  render() {
    let bookArray;
    bookArray = this.state.books.map((book, i) => (
      <div
        onClick={this.goToBook.bind(this, book.bookID)}
        className="book-single-container"
      >
        <img src={book.bookCover} alt="" className="book-img" />
        <h3 className="book-title">{book.title}</h3>
        <div className="book-button-container">
          {/* <button
            className="book-details-button"
            onClick={this.submitAddToCart.bind(this, book.bookID)}
          >
            Add to Cart
          </button> */}
        </div>
      </div>
    ));

    return (
      <div className="home-main-container">
        <Banner />
        <h1 className="home-title">Featured</h1>
        <div className="book-main-container">{bookArray}</div>
        <BottomReview />
      </div>
    );
  }
}

export default withRouter(home);
