import {BASE_URL} from '../constants/base-url';

const getToken = () => localStorage.getItem('jwtToken');

export const loadAllProducts = async () => {

    try {

        const response = await fetch(`${BASE_URL}/product/getAllProducts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            const error = new Error('Failed fetch products');
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchProductsByCategoryId = async (categoryId) => {
    try {
        const response = await fetch(`${BASE_URL}/product/getAllProductsByCategory/${categoryId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error = new Error('Failed fetch products');
            error.status = response.status;
            throw error;
        }
        return await response.json();

    } catch (error) {
        throw error;
    }
};

export const fetchProductById = async (id) => {

    try {

        const response = await fetch(`${BASE_URL}/product/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            const error = new Error('Failed fetch product');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const updateProduct = async (formData) => {

    try {

        const response = await fetch(`${BASE_URL}/product/updateProduct`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = new Error('Failed update product');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.log(error);
        throw error;
    }

};

export const addProduct = async (formData) => {

    try {
        const response = await fetch(`${BASE_URL}/product/addProduct`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = new Error('Failed add product');
            error.status = response.status;
            throw error;
        }

        return response;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const archiveProduct = async (formData) => {

    try {
        const response = await fetch(`${BASE_URL}/product/archiveProduct`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = new Error(await response.text());
            error.status = response.status;
            throw error;    
        }

        return response;

    } catch (error) {
        console.log(error);
        throw error;
    }
};