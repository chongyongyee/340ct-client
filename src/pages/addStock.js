import React, { Component } from "react";

import { withRouter } from "../util/withRouter";

import jwtDecode from "jwt-decode";

import axios from "axios";

import "../styles/addStock.css";

export class addStock extends Component {
  state = {
    title: "",
    author: "",
    stock: "",
    price: "",
    category: "",
    description: "",
    isbn: "",
    discount: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const newStock = {
      title: this.state.title,
      author: this.state.author,
      stock: this.state.stock,
      price: this.state.price,
      category: this.state.category,
      description: this.state.description,
      isbn: this.state.isbn,
      discount: this.state.discount,
      loading: false,
    };

    this.setState({
      loading: true,
    });

    axios
      .post("/stock", newStock)
      .then((res) => {
        window.alert("Book added successfully");
        this.props.navigate("/book-cover");
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
        this.props.navigate("/");
      }
    } else {
      this.props.navigate("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="add-stock-main-container">
        <h1 className="add-stock-title">Add Book</h1>
        <form noValidate onSubmit={this.handleSubmit}>
          <div className="add-stock-input-main-container">
            <div className="add-stock-input-container">
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={this.handleChange}
                className="checkout-input"
              />

              <p className="error">
                {errors ? (errors.title ? errors.title : null) : null}
              </p>
              <input
                type="text"
                placeholder="Author"
                className="add-stock-input"
                onChange={this.handleChange}
                name="author"
              />
              <p className="error">
                {errors ? (errors.author ? errors.author : null) : null}
              </p>
              <input
                type="text"
                placeholder="Category"
                name="category"
                onChange={this.handleChange}
                className="add-stock-input"
              />
              <p className="error">
                {errors ? (errors.category ? errors.category : null) : null}
              </p>
              <input
                type="text"
                name="isbn"
                placeholder="ISBN"
                onChange={this.handleChange}
                className="add-stock-input"
              />
              <p className="error">
                {errors ? (errors.isbn ? errors.isbn : null) : null}
              </p>
            </div>
            <div className="add-stock-input-container">
              <input
                type="text"
                placeholder="Stock"
                onChange={this.handleChange}
                name="stock"
                className="add-stock-input"
              />
              <p className="error">
                {errors ? (errors.stock ? errors.stock : null) : null}
              </p>
              <input
                type="text"
                placeholder="Price"
                onChange={this.handleChange}
                name="price"
                className="add-stock-input"
              />
              <p className="error">
                {errors ? (errors.price ? errors.price : null) : null}
              </p>
              <input
                type="text"
                placeholder="Description"
                onChange={this.handleChange}
                name="description"
                className="add-stock-input"
              />
              <p className="error">
                {errors
                  ? errors.description
                    ? errors.description
                    : null
                  : null}
              </p>
              <input
                type="text"
                placeholder="Discount (optional)"
                onChange={this.handleChange}
                name="discount"
                className="add-stock-input"
              />
            </div>
          </div>

          <div className="add-stock-button-div">
            <button type="submit" className="add-stock-button">
              Add Book
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(addStock);
