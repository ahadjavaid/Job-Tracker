# Frontend Skills & Patterns (React)

## 1. Global State Management (Zustand)
Use Zustand for lightweight, global state management without boilerplate.

```javascript
import { create } from 'zustand';

// Example: Job Store
export const useJobStore = create((set) => ({
  jobs: [],
  selectedJobId: null,
  setJobs: (jobs) => set({ jobs }),
  selectJob: (id) => set({ selectedJobId: id }),
  clearSelectedJob: () => set({ selectedJobId: null }),
}));
```

## 2. Data Fetching (React Query / TanStack Query)
Always use React Query to fetch, cache, and synchronize server state.

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// API call function
const fetchJobs = async () => {
  const { data } = await axios.get('/api/jobs');
  return data;
};

// Custom Hook for fetching
export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });
};

// Custom Hook for mutating data
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newJob) => {
      const { data } = await axios.post('/api/jobs', newJob);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
```

## 3. Component Styling (Tailwind CSS)
Use utility classes for styling. Build UI from small, reusable components.

```javascript
import React from 'react';

export const Button = ({ onClick, children, variant = 'primary' }) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};
```

## 4. API Client (Axios)
Create a central Axios instance for consistent base URLs and interceptors (e.g., attaching JWT tokens).

```javascript
// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
```
