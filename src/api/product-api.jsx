import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';
import {authenticatedFetch} from '../utils/api-client';

export const loadAllProducts = async () => {
    const response = await authenticatedFetch(`${BASE_URL}/product/getAllProducts`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

export const fetchProductsByCategoryId = async (categoryId) => {
    const response = await fetch(`${BASE_URL}/product/getAllProductsByCategory/${categoryId}`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

export const fetchProductById = async (id) => {
    const response = await authenticatedFetch(`${BASE_URL}/product/${id}`, {
        method: "GET"
    });

    await handleResponse(response);
    return await response.json();
};

export const updateProduct = async (formData) => {
    const response = await authenticatedFetch(`${BASE_URL}/product/updateProduct`, {
        method: "POST",
        body: formData
    });

    await handleResponse(response);
    return await response.json();
};

export const addProduct = async (formData) => {
    const response = await authenticatedFetch(`${BASE_URL}/product/addProduct`, {
        method: "POST",
        body: formData
    });

    await handleResponse(response);
    return response;
};

export const archiveProduct = async (formData) => {
    const response = await authenticatedFetch(`${BASE_URL}/product/archiveProduct`, {
        method: 'POST',
        body: formData
    });

    await handleResponse(response);
    return response;
};
