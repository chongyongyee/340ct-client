import React, { Component } from "react";

import "../styles/category.css";

export class SingleCategory extends Component {
  render() {
    return (
      <div className="category-single-container">
        <div className="category-details-container">
          <img src={this.props.icon} alt="" className="category-icon" />
          <h3 className="category-text">{this.props.text}</h3>
        </div>
      </div>
    );
  }
}

export default SingleCategory;
