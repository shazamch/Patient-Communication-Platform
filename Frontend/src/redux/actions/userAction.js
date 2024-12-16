import { apiPost } from '../../config/axiosIntance';
import { loginAsync, logoutAsync, UpdateUserData } from '../reducers/userReducer';
import { showErrorAlert, showSuccessAlert } from './alertActions';

export const login = (credentials) => async (dispatch) => {
    try {
        const result = await apiPost('/auth/login', credentials);
        if (result?.success) {
            const userData = result;
            dispatch(loginAsync(userData));
            dispatch(showSuccessAlert("Logged in successfully"));
        } else {
            dispatch(showErrorAlert("Login failed. Please check your credentials."));
        }
    } catch (error) {
        // Handle Axios error object more effectively
        if (error?.response?.status === 401) {
            dispatch(showErrorAlert("Invalid username or password."));
        } else {
            dispatch(showErrorAlert("Network Error. Please try again."));
        }
        console.error('Login error:', error);
    }
};

// Async logout action
export const logout = () => async (dispatch) => {
    try {
      await dispatch(logoutAsync());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };  

export const updateUser = (data) => async (dispatch) => {
    try {
        dispatch(UpdateUserData(data)); 
    } catch (error) {
        console.error('Update user error:', error);
        dispatch(showErrorAlert("An error occurred while updating user data. Please try again."));
    }
};

export const signup = (userDetails) => async (dispatch) => {
    try {
      const result = await apiPost('/auth/signup', userDetails);
      if (result?.success) {
        const userData = result;
        dispatch(loginAsync(userData));
        dispatch(showSuccessAlert("Account created successfully! You are now logged in."));
    } else {
        dispatch(showErrorAlert(result?.message || "Signup failed. Please check your details and try again."));
    }
    } catch (error) {
      if (error?.response?.message) {
        dispatch(showErrorAlert(error.response.data.message));
      } else {
        dispatch(showErrorAlert("Network Error. Please try again."));
      }
      console.error('Signup error:', error);
    }
  };  