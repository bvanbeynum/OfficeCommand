// /home/bvanbeynum/dev/officecommand/frontend/utils/api.js

const API_BASE_URL = '/api'; // Backend and frontend share the same origin

// Helper to process the standardized API response structure
const _handleApiResponse = async (response) => {
	const jsonResponse = await response.json();
	if (jsonResponse.success) {
		return { success: true, data: jsonResponse.data, error: null };
	} else {
		// Even if the HTTP status is 2xx, if success: false, it's an API-level error
		return { success: false, data: null, error: jsonResponse.error || 'An unknown API error occurred' };
	}
};

// Generic fetch wrapper to handle API calls, including network errors and standardized response parsing

const get = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            // If HTTP status is not OK, throw an error to be caught by the outer catch block
            const errorBody = await response.text(); // or response.json() if API always returns JSON
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
        }
        return await _handleApiResponse(response);
    } catch (networkError) {
        console.error('Network or parsing error for GET request:', networkError);
        return { success: false, data: null, error: networkError.message || 'Network error occurred' };
    }
};

const post = async (endpoint, payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
        }
        return await _handleApiResponse(response);
    } catch (networkError) {
        console.error('Network or parsing error for POST request:', networkError);
        return { success: false, data: null, error: networkError.message || 'Network error occurred' };
    }
};

const fetchCurrentSensors = async () => {
    const response = await get('/sensors/current');
    return response;
};

const fetchHistory = async (timeframe) => {
    // Ensure timeframe is sanitized or validated if it comes from user input
    const response = await get(`/sensors/history?timeframe=${timeframe}`);
    return response;
};

const postSettings = async (data) => {
    const response = await post('/settings', data);
    return response;
};

const postError = async (err) => {
    // Assuming 'err' is an object with 'source', 'message', 'details' fields as per PRD
    const errorPayload = {
        source: err.source || 'frontend',
        message: err.message || 'An unknown frontend error occurred',
        details: err.details || (err instanceof Error ? err.stack : JSON.stringify(err)),
        timestamp: new Date().toISOString(), // Add a timestamp for backend
    };
    const response = await post('/errors', errorPayload);
    return response;
};

export { get, post, fetchCurrentSensors, fetchHistory, postSettings, postError };
