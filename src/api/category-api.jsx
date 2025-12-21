import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';
import {authenticatedFetch} from '../utils/api-client';

export const fetchAllCategories = async () => {
    const response = await authenticatedFetch(`${BASE_URL}/category/getAllCategories`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

export const addCategory = async (name, image, showOnSite) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('showOnSite', showOnSite);

    const response = await authenticatedFetch(`${BASE_URL}/category/addCategory`, {
        method: 'POST',
        body: formData,
    });

    await handleResponse(response);
    return await response.json();
};

export const editCategory = async (id, name, image, showOnSite) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('image', image); // TODO: Set this only if image was changed
    formData.append('showOnSite', showOnSite);

    const response = await authenticatedFetch(`${BASE_URL}/category/updateCategory`, {
        method: 'POST',
        body: formData
    });

    await handleResponse(response);
    return await response.json();
};

export const loadAllCategoriesWithIdAndNames = async () => {
    const response = await authenticatedFetch(`${BASE_URL}/category/getAllCategoriesWithIdAndNames`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

export const loadAllCategoriesWithProducts = async () => {
    const response = await fetch(`${BASE_URL}/category/getAllCategoriesWithProducts`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};
