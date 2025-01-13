import {BASE_URL} from '../constants/base-url';

const getToken = () => localStorage.getItem('jwtToken');

export const loadOrdersByStatus = async (status) => {

    try {
        const response = await fetch(`${BASE_URL}/order/getAllByStatus/${status}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {

            const error = new Error('Failed fetch orders');
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const changeOrderStatus = async (orderId, status) => {

    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('status', status);

    try {

        const response = await fetch(`${BASE_URL}/order/updateOrderStatus`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {

            const error = new Error('Failed fetch orders');
            error.status = response.status;
            throw error;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const createOrder = async (orderDtoRequest) => {

    try {
        const response = await fetch(`${BASE_URL}/order/add`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderDtoRequest)
        });

        if (!response.ok) {
            const error = new Error('Failed fetch orders');
            error.status = response.status;
            throw error;
        }

        return response;
        

    } catch (error) {
        console.log(error);
        throw error;
    }
};