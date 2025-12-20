import {BASE_URL} from '../constants/base-url';

/**
 * Fetch a single image by type
 * @param {string} type - The image type (e.g., "home_banner")
 * @returns {Promise} Image object
 */
export const fetchImageByType = async (type) => {
    try {
        const response = await fetch(`${BASE_URL}/images/getImageByType?type=${encodeURIComponent(type)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // Image not found
            }
            const error = new Error('Failed to fetch image');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error('Error fetching image by type:', error);
        throw error;
    }
};

/**
 * Fetch all images by type
 * @param {string} type - The image type (e.g., "home_gallery")
 * @returns {Promise} Array of image objects
 */
export const fetchImagesByType = async (type) => {
    try {
        const response = await fetch(`${BASE_URL}/images/getImagesByType?type=${encodeURIComponent(type)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error = new Error('Failed to fetch images');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error('Error fetching images by type:', error);
        throw error;
    }
};
