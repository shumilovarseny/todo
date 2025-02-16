import React, { useRef, useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { $login } from "../http/authorizationApi";

export const Login = () => {
  const email = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const loginUser = async () => {
    const emailValue = email.current.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      return setErrorMessage("Некорректный email");
    }
    const passwordValue = password.current.value;
    if (passwordValue.length < 8) {
      return setErrorMessage("Пароль должен состоять хотя бы из 8 символов");
    }
    const token = await $login(emailValue, passwordValue);
    if (token.error) setErrorMessage(token.error);
    else navigate("/");
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-[500px] m-auto">
        <h1 className="mb-[50px] mt-[-75px] mx-auto text-[50px] font-light">
          TODO
        </h1>
        <div className="h-[320px] w-[500px] border-1 rounded-lg px-[20px] pt-[30px] flex flex-col relative">
          <span className="h-10px absolute top-[5px] text-red-800 w-[450px] overflow-hidden text-ellipsis  text-nowrap">
            {errorMessage}
          </span>
          <CustomInput refer={email}>
            <span>Почта</span>
            <span className="text-[16px] ml-auto mr-0">
              <Link to="/registration">Создать аккаунт</Link>
            </span>
          </CustomInput>
          <CustomInput refer={password} type="password">
            Пароль
          </CustomInput>
          <CustomButton className="m-auto" click={loginUser}>
            Войти
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
