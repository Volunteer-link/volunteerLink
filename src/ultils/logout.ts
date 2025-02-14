import { useNavigate } from "react-router-dom";
import { deleteCookie } from "./cookie";

export function useLogout() {
  const navigate = useNavigate();
  return () => {
    deleteCookie("accessToken");
    navigate("/");
  };
}
