import * as actionTypes from "./actions";

const initialState = {
  boxPasscode: "",
  passcode: "",
  lockStatus: "Unlocked",
  statusMessage: "",
  screenIsOff: true,
  serialNumber: "4815162342",
  timerScreenOff: null,
  timerCheckPasscode: null,
  enteringPasscode: false,
  beforeError: "",
  disableButtons: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_LOCK_STATUS:
      return {
        ...state,
        lockStatus: state.lockStatus === "Unlocked" ? "Locked" : "Unlocked",
      };
    case actionTypes.READY:
      return {
        ...state,
        statusMessage: "Ready",
      };
    case actionTypes.SET_LOCKING:
      return {
        ...state,
        statusMessage: "Locking...",
      };
    case actionTypes.SET_UNLOCKING:
      return {
        ...state,
        statusMessage: "Unlocking...",
      };
    case actionTypes.ERROR:
      return {
        ...state,
        beforeError:
          state.statusMessage === "Error"
            ? state.beforeError
            : state.statusMessage,
        statusMessage: "Error",
        passcode: "",
      };
    case actionTypes.SET_BOX_PASSCODE:
      return {
        ...state,
        boxPasscode: state.passcode.slice(0, 6),
        passcode: "",
      };
    case actionTypes.UPDATE_SCREEN:
      return {
        ...state,
        screenIsOff: !state.screenIsOff,
      };
    case actionTypes.UPDATE_PASSCODE:
      return {
        ...state,
        passcode: action.value,
      };
    case actionTypes.SET_CHECK_PASSCODE_TIMER:
      return {
        ...state,
        timerCheckPasscode: setInterval(action.callbackFunc, 1200),
      };
    case actionTypes.SET_SCREEN_OFF_TIMER:
      return {
        ...state,
        timerScreenOff: setInterval(action.callbackFunc, 5000),
      };
    case actionTypes.CLEAR_CHECK_PASSCODE_TIMER:
      return {
        ...state,
        timerCheckPasscode: null,
      };
    case actionTypes.CLEAR_SCREEN_OFF_TIMER:
      let updatedStatus = null;
      if (
        state.beforeError === "Ready" ||
        state.beforeError === "Validating..."
      )
        updatedStatus = "Ready";
      else updatedStatus = "";
      return {
        ...state,
        timerScreenOff: null,
        statusMessage:
          state.statusMessage !== "Ready" ? updatedStatus : state.statusMessage,
        passcode: "",
      };
    case actionTypes.ENTERING_PASSCODE:
      return {
        ...state,
        enteringPasscode: !state.enteringPasscode,
      };
    case actionTypes.SERVICE:
      return {
        ...state,
        statusMessage: "Service",
        passcode: "",
      };
    case actionTypes.VALIDATING:
      return {
        ...state,
        statusMessage: "Validating...",
      };
    case actionTypes.RESET:
      return {
        ...state,
        boxPasscode: "",
        passcode: "",
        lockStatus: "Unlocked",
        statusMessage: "",
        enteringPasscode: false,
        beforeError: "",
      };
    case actionTypes.DISABLE_BUTTONS:
      return {
        ...state,
        disableButtons: true,
      };
    case actionTypes.ENABLE_BUTTONS:
      return {
        ...state,
        disableButtons: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
