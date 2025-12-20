import {BASE_URL} from '../constants/base-url';

export const getImageUrl = (path) => {
    const baseUrl = `${BASE_URL}/images/getImage`;

    // If path is a full path (e.g., /app/images/filename.jpg), extract just the filename
    // Otherwise, use the path as-is
    let filename = path;
    if (path && path.includes('/')) {
        const parts = path.split('/');
        filename = parts[parts.length - 1]; // Get last part (filename)
    }

    return `${baseUrl}?path=${encodeURIComponent(filename)}`;
};
