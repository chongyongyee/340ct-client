import React, { Component } from "react";

import Cart from "../components/Cart";

import trashIcon from "../images/trash_icon@2x.png";

import jwtDecode from "jwt-decode";

import axios from "axios";

import { withRouter } from "../util/withRouter";

import "../styles/cart.css";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import book from "./book";

export class cart extends Component {
  state = {
    errors: {},
    loading: false,
    bookIDs: [],
    books: [],
    username: "",
    totalPrice: 0,
    quantity: 0,
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

  handleDelete = (bookID) => {
    const newDelete = {
      username: this.state.username,
      bookID: bookID,
    };

    console.log(newDelete);

    axios
      .post("/cart/delete", newDelete)
      .then((res) => {
        console.log("Book Deleted");
        let tempBooksArray = this.state.books;
        let deletedBook;

        for (var i = tempBooksArray.length - 1; i >= 0; --i) {
          if (tempBooksArray[i].bookID == bookID) {
            deletedBook = tempBooksArray.splice(i, 1);
          }
        }

        let tempTotalPrice = this.state.totalPrice;
        let tempCurrentPrice = parseFloat(deletedBook[0].price);
        let tempQuantity = this.state.quantity;

        this.setState({
          books: tempBooksArray,
          totalPrice: tempTotalPrice - tempCurrentPrice,
          quantity: tempQuantity - 1,
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
  };

  render() {
    let cartDisplay;
    cartDisplay = this.state.books.map((book) => {
      return (
        <div className="cart-single-container">
          <img src={book.bookCover} alt="" className="cart-single-img" />
          <div className="cart-single-details-container">
            <h4 className="cart-single-title">{book.title}</h4>
            <p className="cart-single-price">RM {book.price}</p>
            <h5 className="cart-single-quantity">1</h5>
            <img
              src={trashIcon}
              alt=""
              onClick={this.handleDelete.bind(this, book.bookID)}
              className="cart-single-trash-icon"
            />
          </div>
        </div>
      );
    });

    return (
      <div className="cart-main-container">
        <h1 className="cart-title">Your cart</h1>
        <div>{cartDisplay}</div>
        <div className="cart-summary">
          <h1 className="cart-summary-text">
            Total ({this.state.quantity} item(s)): RM{" "}
            {this.state.totalPrice.toFixed(2)}
          </h1>
          <Link to="/checkout" className="cart-button">
            Checkout
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(cart);
