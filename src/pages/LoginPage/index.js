import React, { useState, useContext } from "react";
import Button from "../../components/General/Button";
import css from "./style.module.css";
import Spinner from "../../components/General/Spinner";
import { Redirect } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Login = (props) => {
  const ctx = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const changeEmail = (e) => {
    const newEmail = e.target.value;
    setForm((formBefore) => ({
      email: newEmail,
      password: formBefore.password,
    }));
  };

  const changePassword = (e) => {
    const newPassword = e.target.value;
    setForm((formBefore) => ({
      email: formBefore.email,
      password: newPassword,
    }));
  };

  const login = () => {
    ctx.loginUser(form.email, form.password);
  };

  return (
    <div className={css.Login}>
      {ctx.state.userId && <Redirect to="/orders" />}
      <input onChange={changeEmail} type="text" placeholder="Имэйл хаяг" />
      <input onChange={changePassword} type="password" placeholder="Нууц үг" />
      {ctx.state.logginIn && <Spinner />}
      {ctx.state.firebaseError && (
        <div style={{ color: "red" }}>
          {ctx.state.firebaseError} код нь : {ctx.state.firebaseErrorCode}
        </div>
      )}
      <Button text="ЛОГИН" btnType="Success" daragdsan={login} />
    </div>
  );
};

export default Login;
