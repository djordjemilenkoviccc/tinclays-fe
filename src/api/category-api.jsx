import {BASE_URL} from '../constants/base-url';

const getToken = () => localStorage.getItem('jwtToken');

export const fetchAllCategories = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${BASE_URL}/category/getAllCategories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = new Error('Failed to fetch categories');
            error.status = response.status;
            throw error;
        }
        return await response.json();

    } catch (error) {
        console.error('Error in addCategory:', error);
        throw error;
    }
};

export const addCategory = async (name, image, showOnSite) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('showOnSite', showOnSite);

    try {
        const response = await fetch(`${BASE_URL}/category/addCategory`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = new Error('Failed add new category');
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } catch (error) {
        console.error('Error in addCategory:', error);
        throw error;
    }
};

export const editCategory = async (id, name, image, showOnSite) => {

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('image', image); // TODO: Set this only if image was changed
    formData.append('showOnSite', showOnSite);

    try {
        const response = await fetch(`${BASE_URL}/category/updateCategory`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = new Error('Failed edit category');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const loadAllCategoriesWithIdAndNames = async () => {

    try {
        const response = await fetch(`${BASE_URL}/category/getAllCategoriesWithIdAndNames`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            const error = new Error('Failed add new category');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const loadAllCategoriesWithProducts = async () => {

    try {
        const response = await fetch(`${BASE_URL}/category/getAllCategoriesWithProducts`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error = new Error('Failed fetch categories');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};