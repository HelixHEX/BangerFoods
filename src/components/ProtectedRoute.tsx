import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../utils/UserContex";

type ProtectedRouteProps = {
  pathname: string;
  outlet: JSX.Element;
};

const ProtectedRoute = ({ pathname, outlet }: ProtectedRouteProps) => {
  const { session } = useContext(UserContext);

  return session ? outlet : <Navigate to={{ pathname }} />;
};

export default ProtectedRoute;
