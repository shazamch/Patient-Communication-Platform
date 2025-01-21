import { apiGet, apiPost } from '../../config/axiosIntance'; // Assume these functions handle HTTP requests
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions'; // Assume these are alert actions

const appointmentMiddleware = {
  // Create a new task
  createAppointment: (taskData) => {
    return async (dispatch) => {
      try {
        const response = await apiPost('/protected/appointment/', taskData);

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
  getAllAppointments: () => {
    return async (dispatch) => {
      try {
        const response = await apiGet('/protected/appointment/');

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

  getAllAppointmentsByDoctorID: (doctoriD) => {
    return async (dispatch) => {
      try {
        const response = await apiGet(`/protected/appointment/doctor/${doctoriD}`);

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

export default appointmentMiddleware;
