import { apiDelete, apiGet, apiPost, apiPut } from '../../config/axiosIntance';
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions';
import { loginAsync, logoutAsync } from '../reducers/userReducer';

const umsMiddleware = {
    AddNewAdmin: (adminData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPost('/auth/create-admin', adminData);

                    if (response.success) {
                        dispatch(showSuccessAlert("Admin created successfully"))
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    // dispatch(LoaderAction.LoaderFalse());
                    if (e.response.status === 403 && e.response.data.message === "Access Denied.") {
                        dispatch(showErrorAlert(e.response.data.message));
                    }
                    reject(e);
                }
            });
        };
    },

    GetAllUsers: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/user/");

                    if (response.success) {
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    // dispatch(LoaderAction.LoaderFalse());
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

    UpdateAdmin: (userId, userData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiPut(`/admin/api/user/${userId}`, userData);


                    if (response.success) {

                        dispatch(showSuccessAlert("User updated successfully"))

                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    // dispatch(LoaderAction.LoaderFalse());
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

    DeleteAdmin: (userId, userData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPost(`/admin/api/user/delete/${userId}`, userData);

                    if (response.success) {

                        dispatch(showSuccessAlert("User dleted successfully"))

                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    // dispatch(LoaderAction.LoaderFalse());
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },


    changeUserPassword: (oldPassword, NewPassword) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPost('/api/password/change',
                        {
                            "oldPassword": oldPassword,
                            "newPassword": NewPassword,
                        })

                    if (response.success) {
                        dispatch(showSuccessAlert("Password changed successfully"))
                        dispatch(logoutAsync())
                        resolve(response);
                    } else {
                        dispatch(showErrorAlert("Invalid Old password"));
                        reject(response);
                    }
                } catch (e) {
                    dispatch(showErrorAlert("Invalid Old password"));
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },


};


export default umsMiddleware;
