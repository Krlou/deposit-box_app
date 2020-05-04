import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./BacklitScreen.module.css";

class BacklitScreen extends Component {
  state = {};

  render() {
    let show = this.props.statusMessage;
    if (this.props.enteringPasscode) show = this.props.passcode;

    return (
      <div
        className={
          this.props.screenIsOff
            ? classes.backlitScreen
            : [classes.backlitScreen, classes.backlitScreenOff].join(" ")
        }
      >
        <div className={classes.backlitScreen__LockStatus}>
          {this.props.lockStatus}
        </div>
        <div className={classes.backlitScreen__StatusMessage}>{show}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lockStatus: state.lockStatus,
    statusMessage: state.statusMessage,
    screenIsOff: state.screenIsOff,
    passcode: state.passcode,
    enteringPasscode: state.enteringPasscode,
  };
};

export default connect(mapStateToProps)(BacklitScreen);
