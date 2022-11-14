import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withRouter } from "../util/withRouter";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import jwtDecode from "jwt-decode";

import { loginUser } from "../redux/actions/userActions";

import "../styles/login.css";

export class login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
    errors: {},
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const loginData = {
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("/login", loginData)
      .then((res) => {
        const FBIdToken = `Bearer ${res.data.idToken}`;
        localStorage.setItem("FBIdToken", FBIdToken);
        axios.defaults.headers.common["Authorization"] = FBIdToken;
        this.setState({
          errors: null,
          loading: false,
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

  render() {
    const { errors } = this.state;

    return (
      <div className="login-main-container">
        <div className="login-inner-container">
          <h1 className="login-title">Log In</h1>
          <form noValidate onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="login-input"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <p className="error">
              {errors ? (errors.email ? errors.email : null) : null}
            </p>
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <p className="error">
              {errors ? (errors.password ? errors.password : null) : null}
            </p>
            <button type="submit" className="login-button">
              Log In
            </button>
            <p className="error">
              {errors ? (errors.general ? errors.general : null) : null}
            </p>
          </form>
          <div className="login-alternate">
            <p className="login-alternate-text">Don't have an account?</p>
            <Link className="login-alternate-link">Signup</Link>
            <p className="login-alternate-text">instead</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(login);
