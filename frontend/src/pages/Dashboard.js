import { useContext } from "react";
import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <div>Welcome to the Dashboard! {user.email} </div>;
};

export default Dashboard;

