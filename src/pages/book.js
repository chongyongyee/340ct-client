import React, { Component } from "react";
import { withRouter } from "../util/withRouter";

import jwtDecode from "jwt-decode";

import axios from "axios";

import "../styles/book.css";

export class book extends Component {
  state = {
    book: {},
    reviews: [],
    username: "",
    loading: false,
    newReview: "",
    errors: {},
    newPrice: "",
  };

  componentDidMount() {
    this.setState({
      loading: true,
    });
    let bookID = localStorage.getItem("currentBook");
    let username = localStorage.getItem("username");
    let userType = localStorage.getItem("userType");
    if (!bookID) {
      this.props.navigate("/");
    }
    console.log(bookID);

    const search = {
      bookID: bookID,
    };

    axios
      .post("/get-book", search)
      .then((res) => {
        this.setState({
          loading: false,
          book: res.data.bookData,
          reviews: res.data.reviews,
          username: username,
          userType: userType,
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submitAddToCart = () => {
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

    let bookID = localStorage.getItem("currentBook");
    let username = localStorage.getItem("username");

    const newCart = {
      username: username,
      bookID: bookID,
    };

    console.log(newCart);

    axios
      .post("/cart", newCart)
      .then((res) => {
        window.alert("Added to cart successfully");
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

  handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.FBIdToken;

    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        this.props.navigate("/");
      }
    } else {
      this.props.navigate("/login");
    }

    if (this.state.newReview == "") {
      this.setState({
        errors: {
          review: "Must not be empty",
        },
      });
    } else {
      this.setState({
        errors: {},
      });

      const newReview = {
        data: this.state.newReview,
        username: this.state.username,
        bookID: this.state.book.bookID,
      };

      console.log(newReview);

      axios
        .post("/review", newReview)
        .then((res) => {
          window.alert("Review added succesfully");

          let tempReview = this.state.reviews;
          tempReview.push(newReview);
          this.setState({
            reviews: tempReview,
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
  };

  hanldeDelete = () => {
    axios.post("/");
  };

  handlePriceUpdate = () => {
    const newPrice = {
      bookID: this.state.book.bookID,
      price: this.state.newPrice,
    };

    axios
      .post("/price", newPrice)
      .then((res) => {
        let tempBook = this.state.book;
        tempBook.price = this.state.newPrice;
        this.setState({
          book: tempBook,
          newPrice: "",
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
  };

  render() {
    let inStock = this.state.book.stock > 0 ? "in stock" : "out of stock";

    let addToCart =
      this.state.userType == "admin" ? null : (
        <button className="book-details-button" onClick={this.submitAddToCart}>
          Add to Cart
        </button>
      );

    let reviews = this.state.reviews.map((review) => {
      return (
        <div className="book-details-review-items">
          <div className="book-details-review-userdata-container">
            <h5 className="book-details-review-username">{review.username}</h5>
          </div>
          <h4 className="book-details-review-text">{review.data}</h4>
        </div>
      );
    });

    let reviewOrAdminActions =
      this.state.userType == "admin" ? (
        <div>
          <h2>Update Price</h2>
          <input
            type="text"
            className="book-newreview-input"
            placeholder="New Price"
            name="newPrice"
            value={this.state.newPrice}
            onChange={this.handleChange}
          />
          <button
            onClick={this.handlePriceUpdate}
            className="book-details-button"
          >
            Update Price
          </button>
        </div>
      ) : (
        <div className="book-newreview-container">
          <h2 className="book-details-review-title">Leave a Review</h2>
          <form noValidate onSubmit={this.handleSubmit}>
            <input
              className="book-newreview-input"
              type="text"
              placeholder="Your review"
              name="newReview"
              value={this.state.newReview}
              onChange={this.handleChange}
            />
            <button className="book-newreview-button">Leave a Review</button>
          </form>
        </div>
      );

    return (
      <div className="book-details-main-container">
        <div className="book-details-inner-container">
          <img
            src={this.state.book.bookCover}
            alt=""
            className="book-details-img"
          />
          <div className="book-details-info-container">
            <h2 className="book-details-title">{this.state.book.title}</h2>
            <p className="book-details-small-text">{this.state.book.author}</p>

            <h5 className="book-details-summary">
              {this.state.book.description}
            </h5>

            <h5 className="book-details-instock">{inStock}</h5>

            <h5 className="book-details-price">RM {this.state.book.price}</h5>

            {addToCart}
          </div>
        </div>

        {reviewOrAdminActions}

        <div className="book-details-review-container">
          <h1 className="book-details-review-title">Reviews</h1>
          {reviews}
        </div>
      </div>
    );
  }
}

export default withRouter(book);
