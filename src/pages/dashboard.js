import React, { Component } from "react";

import bookSoldIcon from "../images/book_sold_icon@2x.png";
import booksAvailableIcon from "../images/books_available_icon@2x.png";
import profitIcon from "../images/profit_icon@2x.png";

import axios from "axios";

import jwtDecode from "jwt-decode";

import { withRouter } from "../util/withRouter";

import "../styles/dashboard.css";

export class dashboard extends Component {
  state = {
    books: [],
    numOfSales: 0,
    profits: 0,
    numOfBooks: 0,
    errors: {},
  };

  componentDidMount() {
    const token = localStorage.FBIdToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        this.props.navigate("/");
      }
    } else {
      this.props.navigate("/");
    }

    axios
      .get("/dashboard")
      .then((res) => {
        this.setState({
          books: res.data.books,
          numOfBooks: res.data.numOfBooks,
          numOfSales: res.data.numOfSales,
          profits: res.data.profits,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({
            errors: error.response.data,
          });
        } else {
          this.setState({
            errors: error.response,
          });
        }
        console.error(error.response);
      });
  }

  goToBook = (bookID) => {
    localStorage.setItem("currentBook", bookID);
    localStorage.setItem("username", this.state.username);
    localStorage.setItem("userType", "admin");
    this.props.navigate("/book");
  };

  render() {
    let books = this.state.books.map((book) => {
      return (
        <div
          onClick={this.goToBook.bind(this, book.bookID)}
          className="dashboard-book-list-container"
        >
          <h3 className="dashboard-book-title">{book.title}</h3>
          <div className="dashboard-book-inner-container">
            <h3 className="dashboard-book-title">{book.stock}</h3>
            <h3 className="dashboard-book-title-instock">In Stock</h3>
            <h3 className="dashboard-book-title">RM {book.price}</h3>
          </div>
        </div>
      );
    });

    return (
      <div className="dashboard-main-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-info-div">
          <div className="dashboard-info-item">
            <img
              className="dashboard-info-icon"
              src={booksAvailableIcon}
              alt=""
            />
            <h5 className="dashboard-info-text">
              {this.state.numOfBooks} books
            </h5>
          </div>
          <div className="dashboard-info-item">
            <img className="dashboard-info-icon" src={bookSoldIcon} alt="" />
            <h5 className="dashboard-info-text">
              {this.state.numOfSales} sales
            </h5>
          </div>
          <div className="dashboard-info-item">
            <img className="dashboard-info-icon" src={profitIcon} alt="" />
            <h5 className="dashboard-info-text">
              RM {this.state.profits.toFixed(2)} profit
            </h5>
          </div>
        </div>
        {books}
      </div>
    );
  }
}

export default withRouter(dashboard);
