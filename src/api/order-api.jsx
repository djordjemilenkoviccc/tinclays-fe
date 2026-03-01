import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';
import {authenticatedFetch} from '../utils/api-client';

export const loadOrdersByStatus = async (status) => {
    const response = await authenticatedFetch(`${BASE_URL}/order/getAllByStatus/${status}`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

export const changeOrderStatus = async (orderId, status) => {
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('status', status);

    const response = await authenticatedFetch(`${BASE_URL}/order/updateOrderStatus`, {
        method: 'POST',
        body: formData
    });

    await handleResponse(response);
    return await response.json();
};

export const sendPaymentSlip = async (orderId) => {
    const formData = new FormData();
    formData.append('orderId', orderId);

    const response = await authenticatedFetch(`${BASE_URL}/order/send-slip`, {
        method: 'POST',
        body: formData
    });

    await handleResponse(response);
    return response;
};

export const createOrder = async (orderDtoRequest) => {
    return await fetch(`${BASE_URL}/order/add`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderDtoRequest)
    });
};
