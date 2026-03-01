import {BASE_URL} from '../constants/base-url';
import {handleResponse} from '../utils/error-handler';
import {authenticatedFetch} from '../utils/api-client';

export const subscribeEmail = async (email) => {
    const response = await fetch(`${BASE_URL}/email-notifications/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    });

    await handleResponse(response);
    return await response.json();
};

export const getAllEmailSubscriptions = async () => {
    const response = await authenticatedFetch(`${BASE_URL}/email-notifications/all`, {
        method: 'GET'
    });

    await handleResponse(response);
    return await response.json();
};

export const sendNewCollectionAnnouncement = async () => {
    const response = await authenticatedFetch(`${BASE_URL}/email-notifications/send-new-collection-announcement-ses`, {
        method: 'POST'
    });

    await handleResponse(response);
    return await response.json();
};
