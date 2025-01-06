const BASE_URL = 'http://localhost:8080/api/v1';

const getToken = () => localStorage.getItem('jwtToken');

export const fetchProductsByCategoryId = async (categoryId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/product/getAllProductsByCategory/${categoryId}`, {
            method: 'GET'
        });

        if (!response.ok) {

            throw new Error('Failed to fetch products');
        }
        return await response.json();
        
    } catch (error) {
        throw error;
    }
};