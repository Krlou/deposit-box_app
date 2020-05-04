import React from "react";

import ControlPanel from "./components/ControlPanel/ControlPanel";
import UserManual from "./components/UserManual/UserManual";

import "./App.css";

function App() {
  return (
    <div className="container">
      <ControlPanel />
      <UserManual />
    </div>
  );
}

export default App;
