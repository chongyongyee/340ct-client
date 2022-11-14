import React, { Component } from "react";

import bookIcon3 from "../images/book_eg_icon3@2x.png";
import trashIcon from "../images/trash_icon@2x.png";

import "../styles/cart.css";

export class Cart extends Component {
  render() {
    return (
      <div className="cart-single-container">
        <img src={bookIcon3} alt="" className="cart-single-img" />
        <div className="cart-single-details-container">
          <h4 className="cart-single-title">
            Little Blue Truck’s Halloween: A Halloween Book for Kids
          </h4>
          <p className="cart-single-price">RM 23.90</p>
          <h5 className="cart-single-quantity">1</h5>
          <img src={trashIcon} alt="" className="cart-single-trash-icon" />
        </div>
      </div>
    );
  }
}

export default Cart;
