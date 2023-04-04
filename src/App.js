import React from "react";

import "./App.css";
import AppWrapperRoutes from "./dynamicFiles/AppWrapperRoutes";

import ReactDOM from "react-dom/client";
// import Counter from "./dynamicFiles/dataFetching/Test2";
import GRID_INDIA_LOGO from "./staticFiles/imageFiles/GI-Nav.png";
import LoadingSpinner from "./LoadingSpinner.js";

export default function App() {
  return (
    <div>
      <img src={GRID_INDIA_LOGO} /> <AppWrapperRoutes />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
