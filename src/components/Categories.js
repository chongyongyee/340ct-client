import React, { Component } from "react";

import SingleCategory from "./SingleCategory";

import scifi_icon from "../images/scifi_icon@2x.png";
import adventure_icon from "../images/adventure_icon@2x.png";
import romance_icon from "../images/romance_icon@2x.png";
import mystery_icon from "../images/mystery_icon@2x.png";
import horror_icon from "../images/horror_icon@2x.png";

export class Categories extends Component {
  render() {
    return (
      <div className="category-main-container">
        <SingleCategory icon={mystery_icon} text="Mystery" />
        <SingleCategory icon={adventure_icon} text="Adventure" />
        <SingleCategory icon={horror_icon} text="Horror" />
        <SingleCategory icon={romance_icon} text="Romance" />
        <SingleCategory icon={scifi_icon} text="Sci-Fi" />
      </div>
    );
  }
}

export default Categories;
