import React, { useRef, useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { $registration } from "../http/authorizationApi";

export const Registration = () => {
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const name = useRef(null);
  const surname = useRef(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const registrationUser = async () => {
    const emailValue = email.current.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      return setErrorMessage("Некорректный email");
    }
    const nameValue = name.current.value;
    if (!nameValue) {
      return setErrorMessage("Вы не указали ваше имя");
    }
    const surnameValue = surname.current.value;
    if (!surnameValue) {
      return setErrorMessage("Вы не указали вашу фамилию");
    }
    const passwordValue = password.current.value;
    if (passwordValue.length < 8) {
      return setErrorMessage("Пароль должен состоять хотя бы из 8 символов");
    }
    const confirmPasswordValue = confirmPassword.current.value;
    if (passwordValue != confirmPasswordValue) {
      return setErrorMessage("Подтвердите пароль");
    }

    const token = await $registration(
      emailValue,
      nameValue,
      surnameValue,
      passwordValue
    );
    if (token.error) setErrorMessage(token.error);
    else navigate("/");
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-[500px] m-auto">
        <h1 className="mb-[50px] mt-[-75px] mx-auto text-[50px] font-light">
          TODO
        </h1>
        <div className="h-[500px] w-[500px] border-1 rounded-lg px-[20px] pt-[30px] flex flex-col  relative">
          <span className="h-10px absolute top-[5px] text-red-800 w-[450px] overflow-hidden text-ellipsis  text-nowrap">
            {errorMessage}
          </span>
          <CustomInput refer={email}>
            <span>Почта</span>

            <span className="text-[16px] ml-auto mr-0">
              <Link to="/login">Уже есть аккаунт?</Link>
            </span>
          </CustomInput>
          <div className="flex space-x-4">
            <CustomInput refer={name}>Имя</CustomInput>
            <CustomInput refer={surname}>Фамилия</CustomInput>
          </div>
          <CustomInput refer={password} type="password">
            Пароль
          </CustomInput>
          <CustomInput refer={confirmPassword} type="password">
            Подтверждение пароля
          </CustomInput>
          <CustomButton className="m-auto" click={registrationUser}>
            Создать
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
