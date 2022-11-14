import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import axios from "axios";

import Login, { login } from "./pages/login";
import Home from "./pages/home";
import Signup, { signup } from "./pages/signup";
import Book from "./pages/book";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import AddStock from "./pages/addStock";
import Dashboard from "./pages/dashboard";
import PurchaseHistory from "./pages/purchaseHistory";
import CategoryBooks from "./pages/categoryBooks";
import BookImage from "./pages/bookImage";

import Navbar from "./components/Navbar";

import "./styles/Global.css";
import "./styles/navbar.css";
import purchaseHistory from "./pages/purchaseHistory";
import jwtDecode from "jwt-decode";

import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from "../src/redux/types";

let authenticated;
let loginRoute;
let signupRoute;
const token = localStorage.FBIdToken;

axios.defaults.baseURL = "http://localhost:5000/ct-fbfbf/us-central1/api";

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    authenticated = false;
    localStorage.removeItem("FBIdToken");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  } else {
    authenticated = true;
    axios.defaults.headers.common["Authorization"] = token;
  }
}

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/book" element={<Book />} />
            <Route exact path="/cart" element={<Cart />} />
            <Route exact path="/checkout" element={<Checkout />} />
            <Route exact path="/addstock" element={<AddStock />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route
              exact
              path="/purchase-history"
              element={<PurchaseHistory />}
            />
            <Route exact path="/category-books" element={<CategoryBooks />} />
            <Route exact path="/book-cover" element={<BookImage />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
