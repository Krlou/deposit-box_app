import React, { Component } from "react";
import { connect } from "react-redux";

import KeypadButton from "./KeypadButton/KeypadButton";
import * as actionTypes from "../../../store/actions";

import classes from "./NumberKeypad.module.css";

class NumberKeypad extends Component {
  keyboardKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "L",
    "l",
    "*",
    "A",
    "a",
    "B",
    "b",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ];

  keypadButtons = [
    { button: "7", symbol: null },
    { button: "8", symbol: "8593" },
    { button: "9", symbol: null },
    { button: "4", symbol: "8592" },
    { button: "5", symbol: null },
    { button: "6", symbol: "8594" },
    { button: "1", symbol: null },
    { button: "2", symbol: "8595" },
    { button: "3", symbol: null },
    { button: "*", symbol: "66" },
    { button: "0", symbol: null },
    { button: "L", symbol: "65" },
  ];

  unlockedValidation = (passcode) => {
    const {
      boxPasscode,
      onSetBoxPasscode,
      onLocking,
      onReady,
      onChangeLockStatus,
      onError,
    } = this.props;

    let isValid = false;
    const length = passcode.length;
    if (
      length === 7 &&
      (passcode[length - 1] === "L" || passcode[length - 1] === "l")
    ) {
      const digits = passcode.slice(0, length - 1);
      if (!isNaN(digits)) {
        isValid = true;
      }
    }
    if (
      isValid &&
      (boxPasscode === "" || boxPasscode === passcode.slice(0, 6))
    ) {
      onSetBoxPasscode();

      onLocking();
      setTimeout(() => {
        onReady();
        onChangeLockStatus();
      }, 3000);
    } else {
      onError();
    }
  };

  lockedValidation = (passcode) => {
    const {
      boxPasscode,
      onUnlocking,
      onReady,
      onChangeLockStatus,
      onService,
      onError,
    } = this.props;

    if (passcode === boxPasscode) {
      onUnlocking();
      setTimeout(() => {
        onReady();
        onChangeLockStatus();
      }, 3000);
    } else if (passcode === "000000") {
      onService();
    } else {
      onError();
    }
  };

  serviceValidation = (passcode) => {
    const {
      onValidating,
      serialNumber,
      onUnlocking,
      onReset,
      onError,
    } = this.props;

    onValidating();

    fetch(
      "https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=" +
        passcode
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        if (responseData.sn === serialNumber) {
          onUnlocking();
          setTimeout(() => {
            onReset();
          }, 3000);
        } else {
          onError();
        }
      })
      .catch((error) => {
        console.error("Something went wrong with fetch operation:", error);
      });
  };

  validate = () => {
    const { passcode, lockStatus, statusMessage } = this.props;
    switch (lockStatus) {
      case "Unlocked":
        this.unlockedValidation(passcode);
        break;
      case "Locked":
        if (statusMessage === "Service") this.serviceValidation(passcode);
        else this.lockedValidation(passcode);
        break;
      default:
        throw new Error("Something went wrong! Check lockStatus value...");
    }
  };

  handleScreenOff = () => {
    const {
      timerScreenOff,
      onClearScreenOffTimer,
      onUpdateScreen,
      onEnableButtons,
    } = this.props;

    clearInterval(timerScreenOff);
    onClearScreenOffTimer();

    onUpdateScreen();

    onEnableButtons();
  };

  handleCheckPasscode = () => {
    const {
      timerCheckPasscode,
      onClearCheckPasscodeTimer,
      onDisableButtons,
      enteringPasscode,
      onEnteringPasscode,
    } = this.props;

    clearInterval(timerCheckPasscode);
    onClearCheckPasscodeTimer();

    onDisableButtons();

    if (enteringPasscode) onEnteringPasscode();

    this.validate();
  };

  handleKeypadButtonClicked = (event, symbol) => {
    event.preventDefault();

    const {
      statusMessage,
      onEnableButtons,
      disableButtons,
      screenIsOff,
      onUpdateScreen,
      onEnteringPasscode,
      enteringPasscode,
      timerScreenOff,
      timerCheckPasscode,
      onSetScreenOffTimer,
      onSetCheckPasscodeTimer,
      passcode,
      onUpdatePasscode,
    } = this.props;

    if (statusMessage === "Service") onEnableButtons();

    if (disableButtons) return;

    if (screenIsOff) {
      onUpdateScreen();
      onEnteringPasscode();
    }

    if (statusMessage === "Service" && !enteringPasscode) onEnteringPasscode();

    clearInterval(timerScreenOff);
    clearInterval(timerCheckPasscode);
    onSetScreenOffTimer(this.handleScreenOff);
    onSetCheckPasscodeTimer(this.handleCheckPasscode);

    let updatedPasscode = passcode + symbol;
    onUpdatePasscode(updatedPasscode);
  };

  handleKeyboardEvent(event) {
    if (this.keyboardKeys.includes(event.key)) {
      let symbol = event.key;

      let updatedSymbol = null;
      switch (symbol) {
        case "l":
          updatedSymbol = "L";
          break;
        case "a":
        case "A":
          updatedSymbol = "L";
          break;
        case "b":
        case "B":
          updatedSymbol = "*";
          break;
        case "ArrowUp":
          updatedSymbol = "8";
          break;
        case "ArrowDown":
          updatedSymbol = "2";
          break;
        case "ArrowLeft":
          updatedSymbol = "4";
          break;
        case "ArrowRight":
          updatedSymbol = "6";
          break;
        default:
          updatedSymbol = symbol;
      }
      this.handleKeypadButtonClicked(event, updatedSymbol);
    }
  }

  componentDidMount() {
    document.addEventListener(
      "keyup",
      this.handleKeyboardEvent.bind(this),
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "keyup",
      this.handleKeyboardEvent.bind(this),
      false
    );
  }

  render() {
    let buttons = this.keypadButtons.map((btn) => {
      return (
        <KeypadButton
          key={btn.button}
          symbol={btn.symbol}
          clicked={(event) => this.handleKeypadButtonClicked(event, btn.button)}
        >
          {btn.button}
        </KeypadButton>
      );
    });
    return <div className={classes.numberKeypad}>{buttons}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    timerScreenOff: state.timerScreenOff,
    timerCheckPasscode: state.timerCheckPasscode,
    passcode: state.passcode,
    screenIsOff: state.screenIsOff,
    statusMessage: state.statusMessage,
    lockStatus: state.lockStatus,
    boxPasscode: state.boxPasscode,
    enteringPasscode: state.enteringPasscode,
    serialNumber: state.serialNumber,
    disableButtons: state.disableButtons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDisableButtons: () => dispatch({ type: actionTypes.DISABLE_BUTTONS }),
    onEnableButtons: () => dispatch({ type: actionTypes.ENABLE_BUTTONS }),
    onReset: () => dispatch({ type: actionTypes.RESET }),
    onValidating: () => dispatch({ type: actionTypes.VALIDATING }),
    onService: () => dispatch({ type: actionTypes.SERVICE }),
    onChangeLockStatus: () =>
      dispatch({ type: actionTypes.CHANGE_LOCK_STATUS }),
    onReady: () => dispatch({ type: actionTypes.READY }),
    onLocking: () => dispatch({ type: actionTypes.SET_LOCKING }),
    onUnlocking: () => dispatch({ type: actionTypes.SET_UNLOCKING }),
    onError: () => dispatch({ type: actionTypes.ERROR }),
    onSetBoxPasscode: () => dispatch({ type: actionTypes.SET_BOX_PASSCODE }),
    onUpdateScreen: () => dispatch({ type: actionTypes.UPDATE_SCREEN }),
    onUpdatePasscode: (value) =>
      dispatch({ type: actionTypes.UPDATE_PASSCODE, value: value }),
    onSetScreenOffTimer: (callbackFunc) =>
      dispatch({
        type: actionTypes.SET_SCREEN_OFF_TIMER,
        callbackFunc: callbackFunc,
      }),
    onSetCheckPasscodeTimer: (callbackFunc) =>
      dispatch({
        type: actionTypes.SET_CHECK_PASSCODE_TIMER,
        callbackFunc: callbackFunc,
      }),
    onClearScreenOffTimer: () =>
      dispatch({ type: actionTypes.CLEAR_SCREEN_OFF_TIMER }),
    onClearCheckPasscodeTimer: () =>
      dispatch({ type: actionTypes.CLEAR_CHECK_PASSCODE_TIMER }),
    onEnteringPasscode: () => dispatch({ type: actionTypes.ENTERING_PASSCODE }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NumberKeypad);
