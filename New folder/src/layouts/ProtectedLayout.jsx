import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedLayout() {

 const isAuth = useSelector(
    (state) => state.auth.isAuthenticated
  );

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}