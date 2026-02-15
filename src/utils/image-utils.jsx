import {BASE_URL} from '../constants/base-url';

export const getImageUrl = (path) => {
    const baseUrl = `${BASE_URL}/images/getImage`;

    // Strip the upload directory prefix so the path is relative to the backend's uploadDir
    // e.g. "images/products/thumbnail/uuid.jpg" -> "products/thumbnail/uuid.jpg"
    // e.g. "images/uuid.jpg" -> "uuid.jpg"
    let relativePath = path;
    if (path && path.startsWith('images/')) {
        relativePath = path.substring('images/'.length);
    }

    console.log('getImageUrl - relativePath:', relativePath);
    return `${baseUrl}?path=${encodeURIComponent(relativePath)}`;
};
