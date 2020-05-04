import React from "react";

import classes from "./KeypadButton.module.css";

const KeypadButton = (props) => {
  return (
    <div className={classes.keypadButton} onClick={props.clicked}>
      {props.children}
      <div className={classes.keypadButton__Symbol}>
        {String.fromCharCode(+props.symbol)}
      </div>
    </div>
  );
};

export default KeypadButton;
