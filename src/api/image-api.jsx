import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';
import {authenticatedFetch} from '../utils/api-client';

/**
 * Fetch a single image by type
 * @param {string} type - The image type (e.g., "home_banner")
 * @returns {Promise} Image object or null if not found
 */
export const fetchImageByType = async (type) => {
    const response = await fetch(`${BASE_URL}/images/getImageByType?type=${encodeURIComponent(type)}`, {
        method: 'GET'
    });

    // Handle 404 gracefully - return null if image not found
    if (response.status === 404) {
        return null;
    }

    await handleResponse(response);
    return await response.json();
};

/**
 * Fetch all images by type
 * @param {string} type - The image type (e.g., "home_gallery")
 * @returns {Promise} Array of image objects
 */
export const fetchImagesByType = async (type) => {
    const response = await fetch(`${BASE_URL}/images/getImagesByType?type=${encodeURIComponent(type)}`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

/**
 * Upload an image with a specific type
 * If an image with the same type exists, it will be replaced
 * @param {File} imageFile - The image file to upload
 * @param {string} type - The image type (e.g., "BANNER", "ABOUT_ME")
 * @returns {Promise} Upload response
 */
export const uploadImage = async (imageFile, type) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', type);

    const response = await authenticatedFetch(`${BASE_URL}/images/uploadImage`, {
        method: 'POST',
        body: formData,
    });

    await handleResponse(response);
    return await response.json();
};
