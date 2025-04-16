// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');

    // If token is not found, redirect to the login page
    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    // If token exists, render the protected component
    return children;
};

export default PrivateRoute;
