import React, { Component } from "react";

import Cart from "../components/Cart";

import axios from "axios";

import jwtDecode from "jwt-decode";

import { withRouter } from "../util/withRouter";

import "../styles/cart.css";

export class purchaseHistory extends Component {
  state = {
    username: "",
    history: [],
    loading: false,
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

    this.setState({
      loading: true,
    });

    axios
      .post("/user-data")
      .then((res) => {
        this.setState({
          loading: false,
          username: res.data.credentials.username,
          history: res.data.history,
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

  render() {
    console.log(this.state.history);

    let history = this.state.history.map((book) => {
      return (
        <div className="cart-single-container">
          <img src={book.bookCover} alt="" className="cart-single-img" />
          <div className="cart-single-details-container">
            <h4 className="cart-single-title">{book.title}</h4>
            <p className="cart-single-price">RM {book.amount}</p>
            <h5 className="cart-single-quantity">1</h5>
          </div>
        </div>
      );
    });

    return (
      <div className="cart-main-container">
        <h1 className="cart-title">Purchase History</h1>
        {history}
      </div>
    );
  }
}

export default withRouter(purchaseHistory);
