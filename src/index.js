import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/App";
import { BrowserRouter } from "react-router-dom";
import { UserStore } from "./context/UserContext";

ReactDOM.render(
  <BrowserRouter>
    <UserStore>
      <App />
    </UserStore>
  </BrowserRouter>,

  document.getElementById("root")
);
