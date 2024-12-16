import { apiGet, apiPost, apiPut } from '../../config/axiosIntance';
import { showErrorAlert, showSuccessAlert } from '../actions/alertActions';

const ordersMiddleware = {
    GetAllOrders: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/orders");


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

    UpdateOrder: (OrderDetails) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiPut(`/admin/api/orders/${OrderDetails.OrderID}`, OrderDetails);

                    if (response.success) {
                        dispatch(showSuccessAlert("Order Updated Successfully"));
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    dispatch(LoaderAction.LoaderFalse());
                    console.log('Error fetching single product:', e);
                    reject(e);
                }
            });
        };
    },

    ExportAllOrders: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const response = await apiGet("/admin/api/export/orders");

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

    PlaceNewOrder: (orderToSubmit) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiPost('/admin/api/orders/', orderToSubmit);

                    console.log('Single product response:', response);
                    if (response.success) {
                        // dispatch(LoaderAction.LoaderFalse());
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    dispatch(LoaderAction.LoaderFalse());
                    console.log('Error fetching single product:', e);
                    reject(e);
                }
            });
        };
    },

    GetStartCut: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiGet('/admin/api/orders/Start-Cut');
                    if (response.success) {
                        // dispatch(LoaderAction.LoaderFalse());
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    dispatch(LoaderAction.LoaderFalse());
                    console.log('Error fetching start & cut off day:', e);
                    reject(e);
                }
            });
        };
    },

    UpsrtStartCut: (selectedDays) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiPost('/admin/api/orders/Start-Cut', selectedDays);
                    if (response.success) {
                        // dispatch(LoaderAction.LoaderFalse());
                        resolve(response);
                    } else {
                        // dispatch(LoaderAction.LoaderFalse());
                        reject(response);
                    }
                } catch (e) {
                    dispatch(LoaderAction.LoaderFalse());
                    console.log('Error fetching start & cut off day:', e);
                    reject(e);
                }
            });
        };
    },

};


export default ordersMiddleware;
