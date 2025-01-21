import { apiGet, apiPost } from '../../config/axiosIntance'; // Assume these functions handle HTTP requests
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions'; // Assume these are alert actions

const taskMiddleware = {
  // Create a new task
  createTask: (taskData) => {
    return async (dispatch) => {
      try {
        const response = await apiPost('/protected/task/', taskData);

        if (response.success) {
          dispatch(showSuccessAlert("Task created successfully"));
          return response;
        } else {
          dispatch(showErrorAlert("Error: Task creation failed"));
          throw response;
        }
      } catch (e) {
        dispatch(showErrorAlert("Error: Unable to create task"));
        throw e;
      }
    };
  },

  // Get all tasks
  getAllTasks: () => {
    return async (dispatch) => {
      try {
        const response = await apiGet('/protected/task/');

        if (response.success) {
          dispatch(showSuccessAlert("Tasks fetched successfully"));
          return response;
        } else {
          dispatch(showErrorAlert("Error: Tasks not fetched"));
          throw response;
        }
      } catch (e) {
        dispatch(showErrorAlert("Error: Unable to fetch tasks"));
        throw e;
      }
    };
  },

  getAllTasksByAssiginToID: (userID) => {
    return async (dispatch) => {
      try {
        const response = await apiGet(`/protected/task/assigned/${userID}`);

        if (response.success) {
          dispatch(showSuccessAlert("Tasks fetched successfully"));
          return response;
        } else {
          dispatch(showErrorAlert("Error: Tasks not fetched"));
          throw response;
        }
      } catch (e) {
        dispatch(showErrorAlert("Error: Unable to fetch tasks"));
        throw e;
      }
    };
  },
};

export default taskMiddleware;
