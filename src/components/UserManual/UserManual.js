import React from "react";

import classes from "./UserManual.module.css";

const UserManual = () => {
  return (
    <div className={classes.userManual}>
      <div className={classes.userManual__Container}>
        <p className={classes.userManual__Paragraph}>Locking:</p>
        <ul className={classes.userManual__List}>
          <li>
            Before closing doors enter any 6 digit passcode. Remember the
            passcode!
          </li>
          <li>Close the door and press lock button [L] to lock the safe.</li>
        </ul>
        <p className={classes.userManual__Paragraph}>Unlocking:</p>
        <ul className={classes.userManual__List}>
          <li>
            Enter your 6 digit passcode. If you can’t remember passcode, please
            call reception to help you for a small fee of 5€.
          </li>
          <li>Please leave the door open before checking out from hotel.</li>
        </ul>
      </div>
    </div>
  );
};

export default UserManual;
