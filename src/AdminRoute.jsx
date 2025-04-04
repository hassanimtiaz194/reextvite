import { Navigate } from "react-router-dom";

// Utility function to get user from localStorage
const getUserFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null; // Parse the JSON string back to an object
};

const AdminRoute = ({ element: Component, ...rest }) => {
  const user = getUserFromLocalStorage(); // Get user data from localStorage
  
  return user && user.userType === "admin" ? (
    Component
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
