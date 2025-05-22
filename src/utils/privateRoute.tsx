import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const userLoggedIn = localStorage.getItem("accessToken");
  return userLoggedIn ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoute;
