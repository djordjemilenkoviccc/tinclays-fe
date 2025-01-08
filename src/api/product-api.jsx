const BASE_URL = 'http://localhost:8080/api/v1';

const getToken = () => localStorage.getItem('jwtToken');

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