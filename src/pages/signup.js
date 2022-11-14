import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withRouter } from "../util/withRouter";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import jwtDecode from "jwt-decode";

import axios from "axios";

import { signupUser } from "../redux/actions/userActions";

import "../styles/login.css";

export class signup extends Component {
  state = {
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    errors: {},
    loading: false,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const signupData = {
      email: this.state.email,
      username: this.state.username,
      fullName: this.state.fullName,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    axios
      .post("/signup", signupData)
      .then((res) => {
        const FBIdToken = `Bearer ${res.data.idToken}`;
        localStorage.setItem("FBIdToken", FBIdToken);
        axios.defaults.headers.common["Authorization"] = FBIdToken;
        this.setState({
          loading: false,
          errors: {},
        });
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  componentDidMount() {
    const token = localStorage.FBIdToken;
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
      } else {
        this.props.navigate("/");
      }
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login-main-container">
        <div className="login-inner-container">
          <h1 className="login-title">Sign Up</h1>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="login-input"
            onChange={this.handleChange}
          />
          <p className="error">
            {errors ? (errors.email ? errors.email : null) : null}
          </p>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="login-input"
            onChange={this.handleChange}
          />
          <p className="error">
            {errors ? (errors.username ? errors.username : null) : null}
          </p>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="login-input"
            onChange={this.handleChange}
          />
          <p className="error">
            {errors ? (errors.fullName ? errors.fullName : null) : null}
          </p>
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="login-input"
            onChange={this.handleChange}
          />
          <p className="error">
            {errors ? (errors.password ? errors.password : null) : null}
          </p>
          <p className="login-disclaimer">
            Your password should consist of at least one capital letter, one
            small letter, one number, and should be between 8-16 letters.
          </p>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            className="login-input"
            onChange={this.handleChange}
          />
          <p className="error">
            {errors
              ? errors.confirmPassword
                ? errors.confirmPassword
                : null
              : null}
          </p>
          <button className="login-button" onClick={this.handleSubmit}>
            Sign Up
          </button>
          <p className="error">
            {errors ? (errors.general ? errors.general : null) : null}
          </p>
          <div className="login-alternate">
            <p className="login-alternate-text">Already have an account?</p>
            <Link className="login-alternate-link" to="/login">
              Login
            </Link>
            <p className="login-alternate-text">instead</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(signup);
