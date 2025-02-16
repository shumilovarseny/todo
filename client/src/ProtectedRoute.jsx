import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setToken } from "./reducers/tokenReducer";

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  try {
    const token = Cookies.get("accessToken");
    const dispatch = useDispatch();
    if (!!token) {
      const account = JSON.parse(Cookies.get("user"));
      dispatch(setToken(account));
      return children;
    } else return <Navigate to={redirectTo} />;
  } catch (e) {
    return <Navigate to={redirectTo} />;
  }
};

export default ProtectedRoute;
