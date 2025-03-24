import {BASE_URL} from '../constants/base-url';

export const getImageUrl = (path) => {
    const baseUrl = `${BASE_URL}/images/getImage`;
    return `${baseUrl}?path=/${encodeURIComponent(path)}`;
};
