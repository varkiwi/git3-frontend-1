import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "/assets/scss/App.scss";

const rootEl = document.getElementById("root");

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootEl,
);
