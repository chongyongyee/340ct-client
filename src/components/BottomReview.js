import React, { Component } from "react";

import axios from "axios";

import "../styles/bottomreview.css";

export class BottomReview extends Component {
  state = {
    reviews: null,
  };

  //get review
  componentDidMount() {
    axios
      .get("/review-overall")
      .then((res) => {
        this.setState({
          reviews: res.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //display review
  render() {
    let reviewArray = this.state.reviews ? (
      this.state.reviews.map((review) => (
        <div className="bottom-review-items">
          <h3 className="bottom-review-text">{review.data}</h3>
          <h5 className="bottom-review-subtitle">- {review.username}</h5>
        </div>
      ))
    ) : (
      <p>Loading</p>
    );

    return (
      <div className="bottom-review-main-container">
        <div className="bottom-review-items-container">{reviewArray}</div>
      </div>
    );
  }
}

export default BottomReview;
