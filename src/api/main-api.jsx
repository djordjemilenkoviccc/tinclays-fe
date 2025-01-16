import {BASE_URL} from '../constants/base-url';

const getToken = () => localStorage.getItem('jwtToken');

export const fetchMainMessage = async () => {
    try {

        const response = await fetch(`${BASE_URL}/appsettings/getMainMessage`, {

            method: 'GET'
        });

        if (!response.ok) {

            const error = new Error('Failed fetch main message');
            error.status = response.status;
            throw error;
        }

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const editMainMessage = async (mainMessage, showOnSiteMainMessage, collectionDate, showOnSiteCollectionDate) => {

    const formData = new FormData();
    formData.append('newMainMessage', mainMessage);
    formData.append('showOnSiteMainMessage', showOnSiteMainMessage);
    formData.append('newCollectionDataMessage', collectionDate);
    formData.append('showOnSiteCollectionDate', showOnSiteCollectionDate);


    try {
        const response = await fetch(`${BASE_URL}/appsettings/setMainMessage`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = new Error('Failed to edit main message');
            error.status = response.status;
            throw error;
        }

        return response;

    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
};

export const sendContactMessage = async (formData) => {

    try {
        const response = await fetch(`${BASE_URL}/appsettings/contactMe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const error = new Error('Failed to edit main message');
            error.status = response.status;
            throw error;
        }
        return response;

    } catch (error) {
        console.error("Error sending the message:", error);
        throw error;
    }
};