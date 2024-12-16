import { apiGet, apiPost, apiPut } from '../../config/axiosIntance';
import { showSuccessAlert } from '../actions/alertActions';

const menusMiddleware = {
    GetAllMenus: () => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {

                try {

                    const response = await apiGet('/admin/api/menu/');

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

    CreateNewMenus: (menuData) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {

                try {

                    const response = await apiPost('/admin/api/menu/', menuData);

                    if (response.success) {
                        dispatch(showSuccessAlert("Menu created successfully"))
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

    UpdateMenus: (menu) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {

                try {
                    const response = await apiPost('/admin/api/menu/update', menu);
                    if (response.success) {
                        dispatch(showSuccessAlert("Menu updated Successfully"))
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

    DeleteMenu: (menuId) => {
        return async (dispatch, getState) => {
            return new Promise(async (resolve, reject) => {
                try {
                    
                    const response = await apiPost(`/admin/api/menu/${menuId}`);
                    
                    if (response.success) {
                        dispatch(showSuccessAlert("Menu Deleted Successfully"));
                        resolve(response);
                    } else {
                        dispatch(showErrorAlert("Error: Menu Not Deleted"));
                        reject(response);
                    }
                } catch (e) {

                    dispatch(showErrorAlert("Error: Menu Not Deleted"));
                    reject(e);
                }
            });
        };
    },



};


export default menusMiddleware;
