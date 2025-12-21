import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';

export const authenticateUser = async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });

    await handleResponse(response);
    return await response.json();
};

export const refreshAccessToken = async (refreshToken) => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
    });

    await handleResponse(response);
    return await response.json();
};