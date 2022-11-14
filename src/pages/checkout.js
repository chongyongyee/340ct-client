import React, { Component } from "react";

import axios from "axios";

import jwtDecode from "jwt-decode";

import { withRouter } from "../util/withRouter";

import "../styles/checkout.css";
import book from "./book";

export class checkout extends Component {
  state = {
    username: "",
    loading: false,
    books: [],
    bookIDs: [],
    errors: {},
    totalPrice: 0,
    quantity: 0,
    fullName: "",
    unitNumber: "",
    city: "",
    state: "",
    street: "",
    country: "",
    postcode: "",
    contactNumber: "",
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
      .post("/user-data")
      .then((res) => {
        this.setState({
          bookIDs: res.data.cart.books,
          username: res.data.credentials.username,
        });
      })
      .then(() => {
        this.state.bookIDs.forEach((bookData) => {
          const bookSend = {
            bookID: bookData,
          };
          axios.post("/get-book", bookSend).then((res) => {
            let tempBook = this.state.books;
            let tempTotalPrice = this.state.totalPrice;
            let tempQuantity = this.state.quantity;
            tempBook.push(res.data.bookData);
            this.setState({
              books: tempBook,
              totalPrice: tempTotalPrice + parseFloat(res.data.bookData.price),
              quantity: tempQuantity + 1,
            });
          });
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

  handleSubmit = () => {
    this.state.books.forEach((book) => {
      const newHistory = {
        amount: book.price,
        username: this.state.username,
        quantity: 1,
        bookID: book.bookID,
        title: book.title,
        bookCover: book.bookCover,
      };

      axios
        .post("/history", newHistory)
        .then((res) => {
          const newSales = {
            price: book.price,
            username: this.state.username,
            bookID: book.bookID,
            title: book.title,
            bookCover: book.bookCover,
          };

          axios.post("/sales", newSales).then((res) => {
            if (!this.state.errors.length > 0) {
              window.alert("Checked out successfully");
              this.props.navigate("/purchase-history");
            }
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
    });
  };

  render() {
    let bookData;
    bookData = this.state.books.map((book) => {
      return (
        <div className="checkout-items">
          <h5 className="checkout-item-title">{book.title}</h5>
          <h5 className="checkout-item-price">RM {book.price}</h5>
        </div>
      );
    });

    return (
      <div className="checkout-main-container">
        <h1 className="checkout-title">Address</h1>
        <div className="checkout-input-main-container">
          <div className="checkout-input-container">
            <input
              type="text"
              placeholder="Full Name"
              className="checkout-input"
            />
            <input
              type="text"
              placeholder="Unit Number"
              className="checkout-input"
            />
            <input
              type="text"
              placeholder="Street"
              className="checkout-input"
            />
            <input
              type="text"
              placeholder="Postcode"
              className="checkout-input"
            />
          </div>
          <div className="checkout-input-container">
            <input type="text" placeholder="City" className="checkout-input" />
            <input type="text" placeholder="State" className="checkout-input" />
            <input
              type="text"
              placeholder="Country"
              className="checkout-input"
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="checkout-input"
            />
          </div>
        </div>

        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-summary-container">
          {bookData}
          <hr />
          <h5 className="checkout-item-price">
            SUBTOTAL: RM {this.state.totalPrice.toFixed(2)}
          </h5>
          <button className="checkout-button" onClick={this.handleSubmit}>
            Checkout
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(checkout);
