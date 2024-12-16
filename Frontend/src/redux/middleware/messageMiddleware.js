import { apiPost } from '../../config/axiosIntance';
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions';


const messageMiddleware = {
  // Send message to the server and to the database (via API)
  sendMessage: (ReceiverId, messageData) => {
    return async (dispatch) => {
      try {
        // Send message via REST API (to save in the database)
        const response = await apiPost("/protected/message/send", { message: messageData });
        if (response.success) {
          dispatch(showSuccessAlert('Message sent successfully'));
          return { success: true, message: response };
        } else {
          dispatch(showErrorAlert('Failed to send message via API'));
          return { success: false, message: response };
        }
      } catch (error) {
        console.log(error)
        dispatch(showErrorAlert('Error sending message'));
        return { success: false, message: error.message };
      }
    };
  },
};

export default messageMiddleware;
