import { apiGet, apiPost, apiPut } from '../../config/axiosIntance';
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions';

const customersMiddleware = {
    GetAllCustomers: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/customers/");

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

    GetAllActiveCustomers: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/customers/active");

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

    GetCustomersChanges: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/changes/");

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
    
    GetCustomer: (CustomerID) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                
                    const response = await apiGet(`/admin/api/customers/${CustomerID}`);


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

    ApproveCustomer: (CustomerID) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                
                    const response = await apiPost(`/admin/api/changes/${CustomerID}`);


                    if (response.success) {
                        dispatch(showSuccessAlert("Customer Approved successfully"));
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    dispatch(showErrorAlert("Customer Not Approved "));

                    console.log('Error', e);
                    reject(e);
                }
            });
        };
    },

    
    UpdateCustomer: (formData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPut(`/admin/api/customers/updatealldata/${formData.CustomerID}`, formData);

                    if (response.success) {
                        dispatch(showSuccessAlert("Customer Updated successfully"));
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

    UpdateCustomerRequest: (requestData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPost(`/admin/api/request/action`, requestData);

                    if (response.success) {
                        dispatch(showSuccessAlert("Request Updated successfully"));
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


    GenerateCustomerCredentials: (potentialCustomerID) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiPost("/admin/api/createcustomer/generatecredentials", { potentialCustomerID });


                    if (response.success) {
                        dispatch(showSuccessAlert("Credentials created successfully"));
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

    ImportCustomersDataFile: (formData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiPost('/navinet/upload', formData, null);

                    if (response.success) {
                        dispatch(showSuccessAlert("File imported successfully"));
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

    CustomerPendingForm: (formData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPut(`/admin/api/formintake/updatealldata/${formData.PotentialCustomerID}`, formData);

                    if (response.success) {
                        dispatch(showSuccessAlert("Form successfully Submited"));
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

    GetCustomerRequests: () => {
        return async (dispatch, getState) => {
            try {
                const response = await apiGet("/admin/api/request/");
    
                if (response.success) {
                    return response;
                } else {
                    throw response; // Instead of reject
                }
            } catch (e) {
                console.error('Error', e);
                throw e; // Propagate the error
            }
        };
    },
    

};


export default customersMiddleware;
