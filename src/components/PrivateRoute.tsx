import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  token: string | null;
}

const PrivateRoute = ({ children, token }: PrivateRouteProps) => {
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;