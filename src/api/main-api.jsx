import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';
import {authenticatedFetch} from '../utils/api-client';

export const fetchMainMessage = async () => {
    const response = await fetch(`${BASE_URL}/appsettings/getMainMessage`, {
        method: 'GET'
    });

    await handleResponse(response);
    console.log("BASE URL: " + BASE_URL);
    return await response.json();
};

export const editMainMessage = async (mainMessage, showOnSiteMainMessage, collectionDate, showOnSiteCollectionDate) => {
    const formData = new FormData();
    formData.append('newMainMessage', mainMessage);
    formData.append('showOnSiteMainMessage', showOnSiteMainMessage);
    formData.append('newCollectionDataMessage', collectionDate);
    formData.append('showOnSiteCollectionDate', showOnSiteCollectionDate);

    const response = await authenticatedFetch(`${BASE_URL}/appsettings/setMainMessage`, {
        method: 'POST',
        body: formData
    });

    await handleResponse(response);
    return response;
};

export const sendContactMessage = async (formData) => {
    const response = await fetch(`${BASE_URL}/appsettings/contactMe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    await handleResponse(response);
    return response;
};
