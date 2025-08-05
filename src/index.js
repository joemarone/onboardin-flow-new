import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Gate from "./Gate"; // import the gate

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Gate>
    <App />
  </Gate>
);
