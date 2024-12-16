import { showSuccessAlert as showSuccess, showErrorAlert as showError, showWarningAlert as showWarning, hideAlert as hideToast } from "../reducers/alertReducer";

// Action to show success alert
export const showSuccessAlert = (message) => {
  console.log("Dispatching success alert with message:", message);
  return showSuccess(message);  // Call the auto-generated action from alertReducer
};

// Action to show error alert
export const showErrorAlert = (message) => {
  console.log("Dispatching error alert with message:", message);
  return showError(message);  // Call the auto-generated action from alertReducer
};

// Action to show warning alert
export const showWarningAlert = (message) => {
  console.log("Dispatching warning alert with message:", message);
  return showWarning(message);  // Call the auto-generated action from alertReducer
};

// Action to hide alert
export const hideAlert = () => {
  console.log("Dispatching hide alert action");
  return hideToast();  // Call the auto-generated action from alertReducer
};
