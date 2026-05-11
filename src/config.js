// In production, use the deployed backend URL via REACT_APP_API_URL.
// If that is not set, fall back to the current origin so a same-origin API proxy works.
const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;
export { API_BASE_URL };
