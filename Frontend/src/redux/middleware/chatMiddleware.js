import { apiGet, apiPost } from '../../config/axiosIntance'; // Assume these functions handle HTTP requests
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions'; // Assume these are alert actions

const chatMiddleware = {
  // Get all users (calls the /getallusers route)
  GetAllUsers: () => {
    return async (dispatch, getState) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await apiGet('/protected/conversation/getallusers'); // Updated route

          if (response.success) {
            dispatch(showSuccessAlert("Users fetched successfully"));
            resolve(response);
          } else {
            dispatch(showErrorAlert("Error: Users not fetched"));
            reject(response);
          }
        } catch (e) {
          dispatch(showErrorAlert("Error: Unable to fetch users"));
          reject(e);
        }
      });
    };
  },

  // Get chat stack (calls the /getchatstack route)
  GetChatStack: (userId) => {
    return async (dispatch, getState) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await apiGet(`/protected/conversation/getchatstack/${userId}`); // Updated route

          if (response.success) {
            dispatch(showSuccessAlert("Chat stack fetched successfully"));
            resolve(response);
          } else {
            dispatch(showErrorAlert("Error: Chat stack not fetched"));
            reject(response);
          }
        } catch (e) {
          dispatch(showErrorAlert("Error: Unable to fetch chat stack"));
          reject(e);
        }
      });
    };
  },

  // Find conversation between two users (calls the /getconversation/:userId route)
  FindConversation: (userId1,userId2) => {
    return async (dispatch, getState) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await apiPost("/protected/conversation/getconversation",{userId1,userId2}); // Updated route

          if (response.success) {
            dispatch(showSuccessAlert("Conversation fetched successfully"));
            resolve(response);
          } else {
            dispatch(showErrorAlert("Error: Conversation not found"));
            reject(response);
          }
        } catch (e) {
          dispatch(showErrorAlert("Error: Unable to fetch conversation"));
          reject(e);
        }
      });
    };
  },
};

export default chatMiddleware;
