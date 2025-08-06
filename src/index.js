import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Gate from "./gate";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Gate>
    <App />
  </Gate>
);