import axios from 'axios';

// BASE URL of spring boot backend

const BASE_URL = 'http://localhost:8080';

const api = axios.create ({
    baseURL: BASE_URL
});

// ─────────────────────────────────────────
// This runs before EVERY request
// Automatically adds JWT token to headers!!
// ─────────────────────────────────────────

api.interceptors.request.use((config) => {

    // get token from browser storage 
    const token = localStorage.getItem('token');

    // if token exist, add to authorization header

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// ─────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────

export const loginUser = (credentials) => {
    return api.post('/api/auth/login', credentials);
};

export const registerUser = (userData) => {
    return api.post('/api/users/register', userData);
};

export const getAllUsers = () => {
    return api.get('/api/users');
};

export const deleteUser = (id) => {
    return api.delete(`/api/users/${id}`);
};

// ─────────────────────────────────────────
// JOB ENDPOINTS
// ─────────────────────────────────────────


export const getAllJobs = () => {
    return api.get('/api/jobs');
};

export const getEmployerJobs = () => {
    return api.get('/api/jobs/employer');
};

export const getOpenJobs = () => {
    return api.get('/api/jobs/open');
}

export const searchJobs = (keyword) => {
    return api.get(`/api/jobs/search?keyword=${keyword}`);
};

export const createJob = (jobData) => {
    return api.post('/api/jobs',jobData);
};

export const deleteJob = (id) => {
    return api.delete(`/api/jobs/${id}`);
};

// ─────────────────────────────────────────
// APPLICATION ENDPOINTS
// ─────────────────────────────────────────

 
export const applyToJob = (jobId) => {
    return api.post(`/api/applications?jobId=${jobId}`);
};

export const getMyApplications = () => {
    return api.get('/api/applications/my-applications');
};

export const getAllApplications = () => {
    return api.get('/api/applications');
};

export const getEmployerApplications = () => {
    return api.get('/api/applications/employer');
};

export const updateApplicationStatus = (id, newStatus) => {
    return api.put(`/api/applications/${id}/status?newStatus=${newStatus}`);
};



