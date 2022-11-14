import React, { Component } from "react";
import banner_img_1 from "../images/banner_img_1.jpeg";
import "../styles/banner.css";

export class Banner extends Component {
  render() {
    return (
      <div className="banner-container">
        <img src={banner_img_1} alt="" className="banner-img" />
      </div>
    );
  }
}

export default Banner;
