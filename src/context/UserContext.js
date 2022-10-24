import React, { useState } from "react";
import axios from "../axios-orders";

const UserContext = React.createContext();

const initialState = {
  saving: false,
  logginIn: false,
  error: null,
  errorCode: null,
  token: null,
  userId: null,
  expireDate: null,
};

export const UserStore = (props) => {
  const [state, setState] = useState(initialState);

  const loginUserSucces = (token, userId, expireDate, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expireDate", expireDate);
    localStorage.setItem("refreshToken", refreshToken);

    setState({
      ...state,
      logginIn: false,
      error: null,
      errorCode: null,
      token,
      userId,
      expireDate,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expireDate");
    localStorage.removeItem("refreshToken");
    setState(initialState);
  };

  const autoRenewTokenAfterMillisec = (milliSec) => {
    // token shinechleh code
    axios
      .post(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyDi6fT9CFzYRFMsGd8TU_RgDDz_PY0IM-8",
        {
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem("refreshToken"),
        }
      )
      .then((result) => {
        console.log("Token refreshed .....", result.data);
        const token = result.data.id_token;
        const userId = result.data.user_id;
        const expiresIn = result.data.expires_in;
        const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
        const refreshToken = result.data.refresh_token;

        loginUserSucces(token, userId, expireDate, refreshToken);
      })
      .catch((err) => {
        setState({
          ...state,
          logginIn: false,
          error: err.message,
          errorCode: err.code,
          token: null,
          userId: null,
          expireDate: null,
        });
      });

    // avtomat logout
    setTimeout(() => {
      // logout
      autoRenewTokenAfterMillisec(3600000);
    }, milliSec);
  };

  const loginUser = (email, password) => {
    setState({ ...state, logginIn: true });

    const data = {
      email,
      password,
      returnSecureToken: true,
    };

    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDi6fT9CFzYRFMsGd8TU_RgDDz_PY0IM-8",
        data
      )
      .then((result) => {
        // LocalStorage ruu hadgalna
        console.log("Logged in =======>", result.data);
        console.log(new Date());
        // console.log(new Date(new Date().getTime() + expiresIn * 1000));
        const token = result.data.idToken;
        const userId = result.data.localId;
        const expiresIn = result.data.expiresIn;
        const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
        const refreshToken = result.data.refreshToken;

        loginUserSucces(token, userId, expireDate, refreshToken);

        // dispatch(actions.autoLogoutAfterMillisec(expiresIn * 1000));
      })
      .catch((err) => {
        setState({
          ...state,
          logginIn: false,
          error: err.message,
          errorCode: err.code,
          token: null,
          userId: null,
          expireDate: null,
        });
      });
  };

  const signupUser = (email, password) => {
    setState({ ...state, saving: true });

    const data = {
      email,
      password,
      returnSecureToken: true,
    };

    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDi6fT9CFzYRFMsGd8TU_RgDDz_PY0IM-8",
        data
      )
      .then((result) => {
        // LocalStorage ruu hadgalna
        const token = result.data.idToken;
        const userId = result.data.localId;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        setState({
          ...state,
          saving: false,
          token,
          userId,
          error: null,
          errorCode: null,
        });
      })
      .catch((err) => {
        setState({
          ...state,
          saving: false,
          token: null,
          userId: null,
          error: err.message,
          errorCode: err.code,
        });
      });
  };

  return (
    <UserContext.Provider
      value={{
        state,
        signupUser,
        loginUser,
        logout,
        loginUserSucces,
        autoRenewTokenAfterMillisec,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
