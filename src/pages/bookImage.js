import React, { Component } from "react";

import { useLocation } from "react-router-dom";

import { withRouter } from "../util/withRouter";

import "../styles/addStock.css";
import axios from "axios";
import jwtDecode from "jwt-decode";

export class bookImage extends Component {
  state = {
    loading: false,
    bookID: "",
    errors: {},
  };

  componentDidMount() {
    const token = localStorage.FBIdToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("FBIdToken");
        localStorage.removeItem("FBRefreshToken");
        delete axios.defaults.headers.common["Authorization"];
        this.props.navigate("/login");
      }
    } else {
      this.props.navigate("/login");
    }

    this.setState({
      loading: true,
    });
    axios
      .get("/last-created-book")
      .then((res) => {
        this.setState({
          loading: false,
          bookID: res.data.bookID,
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

  handleUploadImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);

    axios
      .post(`/book/${this.state.bookID}/cover`, formData)
      .then((res) => {
        this.props.navigate("/");
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

  render() {
    const { errors } = this.state;

    return (
      <div className="add-stock-main-container">
        <h1 className="add-stock-title">Upload Book Cover</h1>

        <div className="add-stock-input-main-container">
          <div className="add-stock-input-container">
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={this.handleImageChange}
              hidden="hidden"
              className="checkout-input"
            />
          </div>
        </div>
        <div className="add-stock-button-div">
          <button
            onClick={this.handleUploadImage}
            className="add-stock-button-short"
          >
            Upload Image
          </button>
          <p className="error">
            {errors ? (errors.error ? errors.error : null) : null}
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(bookImage);
