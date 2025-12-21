/**
 * Standardized error handler for API responses
 * Handles different backend error response formats
 */

/**
 * Parse error response from backend
 * Handles multiple formats:
 * 1. GlobalExceptionHandler ErrorResponse: { status, message, timestamp, path }
 * 2. GlobalExceptionHandler ValidationErrorResponse: { status, message, timestamp, errors, path }
 * 3. Map.of("error", message) format: { error: "..." }
 * 4. Plain text responses
 *
 * @param {Response} response - The fetch response object
 * @returns {Promise<Error>} - Error object with message and status
 */
export const parseErrorResponse = async (response) => {
    const error = new Error();
    error.status = response.status;

    try {
        // Try to parse as JSON
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            // Case 1: Standard ErrorResponse from GlobalExceptionHandler
            if (data.message) {
                error.message = data.message;

                // Case 2: ValidationErrorResponse with field errors
                if (data.errors && typeof data.errors === 'object') {
                    error.validationErrors = data.errors;
                    // Create user-friendly message from validation errors
                    const errorMessages = Object.entries(data.errors)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join(', ');
                    error.message = `${data.message}: ${errorMessages}`;
                }
            }
            // Case 3: Map.of("error", message) format
            else if (data.error) {
                error.message = data.error;
            }
            // Case 4: Unknown JSON format
            else {
                error.message = JSON.stringify(data);
            }
        } else {
            // Case 5: Plain text response
            const text = await response.text();
            error.message = text || getDefaultErrorMessage(response.status);
        }
    } catch (parseError) {
        // If parsing fails, use default message
        error.message = getDefaultErrorMessage(response.status);
    }

    return error;
};

/**
 * Get default error message based on HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} - Default error message
 */
const getDefaultErrorMessage = (status) => {
    const messages = {
        400: 'Bad request. Please check your input',
        401: 'Unauthorized. Please login again',
        403: 'Access denied. You don\'t have permission',
        404: 'Resource not found',
        406: 'Request not acceptable',
        409: 'Conflict. Resource already exists',
        413: 'File too large',
        429: 'Too many requests. Please try again later',
        500: 'Server error. Please try again later',
        503: 'Service unavailable. Please try again later'
    };

    return messages[status] || `Request failed with status ${status}`;
};

/**
 * Handle API response and throw error if not OK
 * Use this in API functions instead of manual error handling
 *
 * @param {Response} response - The fetch response object
 * @returns {Promise<Response>} - The response if OK
 * @throws {Error} - Parsed error if response is not OK
 */
export const handleResponse = async (response) => {
    if (!response.ok) {
        throw await parseErrorResponse(response);
    }
    return response;
};

/**
 * Extract error message from error object
 * Handles both our custom errors and generic errors
 *
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
    if (error.message) {
        return error.message;
    }

    if (error.status) {
        return getDefaultErrorMessage(error.status);
    }

    return 'An unexpected error occurred. Please try again';
};

/**
 * Format validation errors for display
 * @param {Object} validationErrors - Map of field to error message
 * @returns {string} - Formatted error message
 */
export const formatValidationErrors = (validationErrors) => {
    if (!validationErrors || typeof validationErrors !== 'object') {
        return '';
    }

    return Object.entries(validationErrors)
        .map(([field, message]) => `• ${field}: ${message}`)
        .join('\n');
};
