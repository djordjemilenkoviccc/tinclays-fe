import { BASE_URL } from '../constants/base-url';
import { refreshAccessToken } from '../api/auth-api';

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

/**
 * Centralized fetch wrapper that automatically handles token refresh on 401 errors
 *
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('jwtToken');

    // Add Authorization header if token exists
    const headers = {
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    // Make the initial request
    let response = await fetch(url, { ...options, headers });

    // If we get a 401, try to refresh the token
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            // No refresh token available, user needs to login
            throw new Error('No refresh token available');
        }

        // If already refreshing, wait for it to complete
        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    // Retry the original request with the new token
                    const newHeaders = {
                        ...options.headers,
                        'Authorization': `Bearer ${newToken}`
                    };
                    resolve(fetch(url, { ...options, headers: newHeaders }));
                });
            });
        }

        isRefreshing = true;

        try {
            // Try to refresh the token
            const refreshResponse = await refreshAccessToken(refreshToken);
            const newAccessToken = refreshResponse.jwtToken;

            // Update localStorage with new token
            localStorage.setItem('jwtToken', newAccessToken);

            // Notify all pending requests that token was refreshed
            onTokenRefreshed(newAccessToken);
            isRefreshing = false;

            // Retry the original request with new token
            const newHeaders = {
                ...options.headers,
                'Authorization': `Bearer ${newAccessToken}`
            };
            response = await fetch(url, { ...options, headers: newHeaders });

        } catch (refreshError) {
            isRefreshing = false;
            // Refresh failed - clear tokens and redirect to login
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('refreshToken');
            throw refreshError;
        }
    }

    return response;
};

/**
 * Helper to get the current JWT token
 */
export const getToken = () => localStorage.getItem('jwtToken');
