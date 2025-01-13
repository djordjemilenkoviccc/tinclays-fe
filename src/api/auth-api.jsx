import {BASE_URL} from '../constants/base-url';

export const authenticateUser = async (username, password) => {

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(`${BASE_URL}/auth/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = new Error('Failed to authenticate user');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
}