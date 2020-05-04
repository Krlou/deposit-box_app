import React from "react";

import BacklitScreen from "./BacklitScreen/BacklitScreen";
import NumberKeypad from "./NumberKeypad/NumberKeypad";

import classes from "./ControlPanel.module.css";

const ControlPanel = () => {
  return (
    <div className={classes.controlPanel}>
      <BacklitScreen />
      <NumberKeypad />
      <div className={classes.controlPanel__Serial}>S/N: 4815162342</div>
    </div>
  );
};

export default ControlPanel;
