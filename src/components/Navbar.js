import React, { Component } from "react";
import { Link } from "react-router-dom";
import cart_icon from "../images/cart_icon@2x.png";
import profile_icon from "../images/profile_icon@2x.png";

import logout_icon from "../images/logout_icon.png";

import jwtDecode from "jwt-decode";

import axios from "axios";

export class Navbar extends Component {
  state = {
    authenticated: false,
    userType: "user",
  };

  componentDidMount() {
    axios
      .post("/user-data")
      .then((res) => {
        this.setState({
          userType: res.data.credentials.userType,
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

  handleLogout = () => {
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authorization"];
    this.props.navigate("/login");
  };
  render() {
    const token = localStorage.FBIdToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        this.setState({
          authenticated: false,
          userType: "user",
        });
      } else {
        this.setState({
          authenticated: true,
        });
      }
    } else {
      this.setState({
        authenticated: false,
        userType: "user",
      });
    }

    let unauthenticated = (
      <div className="navbar-isolated-items">
        <div className="navbar-menu-items">
          <Link className="navbar-items" to="/">
            Home
          </Link>
        </div>

        <img src={cart_icon} alt="" className="navbar-icon" />
        <img src={profile_icon} alt="" className="navbar-icon" />

        <Link rel="stylesheet" to="/signup" className="navbar-button">
          Sign Up
        </Link>
      </div>
    );

    let authenticatedUser = (
      <div className="navbar-isolated-items">
        <div className="navbar-menu-items">
          <Link className="navbar-items" to="/">
            Home
          </Link>
          <Link className="navbar-items" to="/purchase-history">
            History
          </Link>
        </div>

        <Link to="/cart">
          <img src={cart_icon} alt="" className="navbar-icon" />
        </Link>
        <img
          src={logout_icon}
          onClick={this.handleLogout}
          alt=""
          className="navbar-icon"
        />
      </div>
    );

    let authenticatedAdmin = (
      <div className="navbar-isolated-items">
        <div className="navbar-menu-items">
          <Link className="navbar-items" to="/">
            Home
          </Link>
          <Link className="navbar-items" to="/dashboard">
            Dashboard
          </Link>
        </div>

        <img
          src={logout_icon}
          onClick={this.handleLogout}
          alt=""
          className="navbar-icon"
        />

        <Link rel="stylesheet" to="/addstock" className="navbar-button">
          Add Books
        </Link>
      </div>
    );

    let returnNav = this.state.authenticated
      ? this.state.userType == "user"
        ? authenticatedUser
        : authenticatedAdmin
      : unauthenticated;

    return (
      <div className="navbar">
        <h1 className="navbar-logo">Bookshop.</h1>
        {returnNav}
      </div>
    );
  }
}

export default Navbar;
