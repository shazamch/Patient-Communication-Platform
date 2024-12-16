import { apiGet, apiPost } from '../../config/axiosIntance';
import { showSuccessAlert } from '../actions/alertActions';

const vendorsMiddleware = {
    GetAllVendors: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet('/admin/api/vendors/');
                    
                    if (response.success) {
                        // dispatch(showSuccessAlert("Logged in successfully"));
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

    UpdateVendor: (vendorData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await apiPost(`/admin/api/vendors/update`, vendorData);
                    
                    if (response.success) {
                        dispatch(showSuccessAlert("Vendor Status Updated Successfully"));
                        resolve(response);
                    } else {
                        reject(response);
                    }
                } catch (e) {
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

    AddVendor: (vendorData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await apiPost(`/admin/api/vendors/`, vendorData);

                    if (response.success) {
                        dispatch(showSuccessAlert("Vendor Created Successfully"));
                        resolve(response);
                    } else {
                        reject(response);
                    }
                } catch (e) {
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

    DelVendor: (vendorID) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await apiPost(`/admin/api/vendors/delete`, {id: vendorID});

                    if (response.success) {
                        dispatch(showSuccessAlert("Vendor Deleted Successfully"));
                        resolve(response);
                    } else {
                        reject(response);
                    }
                } catch (e) {
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

    GetVendorDishStats: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/orders/vendor-dish-stats");
                    if (response.success) {

                        resolve(response);
                    } else {

                        reject(response);
                    }
                } catch (e) {
                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

};


export default vendorsMiddleware;
