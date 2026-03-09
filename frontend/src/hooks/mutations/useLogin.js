import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { tokenStore } from "../../utils/tokenstore";
import { loginUser } from "../../api/userApi";
import { setCredentials } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
const navigate = useNavigate()
  const dispatch = useDispatch();

  return useMutation({

    mutationFn: loginUser,

    onSuccess: (data) => {
        console.log("LOGIN SUCCESS");
      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      
    dispatch(setCredentials({
        token: data.accessToken,
        user: data.user
      }));
      
      navigate("/dashboard");
    }

  });
};