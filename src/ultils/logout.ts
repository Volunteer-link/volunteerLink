import { useNavigate } from "react-router-dom";
import { deleteCookie } from "./cookie";
import { useContext } from "react";
import WebsocketContext from "./WebsocketContext";
import { useDispatch } from "react-redux";
import { store } from "../redux/store";
import { setUser } from "../redux/slice";

export function useLogout() {
  const navigate = useNavigate();
  const socket = useContext(WebsocketContext);
  const dispatch = useDispatch<typeof store.dispatch>();

  return () => {
    deleteCookie("accessToken");
    navigate("/");
    socket?.close();
    dispatch(setUser(undefined));
  };
}
