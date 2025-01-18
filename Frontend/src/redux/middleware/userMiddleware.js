import { apiGet, apiPost } from '../../config/axiosIntance'; // Assume these functions handle HTTP requests
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions'; // Assume these are alert actions

const userMiddleware = {
  // Get all users (calls the /getallusers route)
  GetAllUsers: () => {
    return async (dispatch, getState) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await apiGet('/protected/users/');

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

  };

export default userMiddleware;
