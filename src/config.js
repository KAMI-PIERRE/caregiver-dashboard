// In production, use the deployed backend URL via REACT_APP_API_URL.
// For local development, use the same host with backend port 5000.
const defaultLocalUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
const API_BASE_URL = process.env.REACT_APP_API_URL || defaultLocalUrl;
export { API_BASE_URL };
