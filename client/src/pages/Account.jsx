import React, { useEffect, useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { $deleteUser, $editUser, $getUser } from "../http/usersApi";
import { useSelector } from "react-redux";
import { $logout } from "../http/authorizationApi";

export const Account = ({ myAccount = false }) => {
  const { userId } = useParams();
  const tokenData = useSelector((state) => state.token.value);

  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: null,
    name: null,
    surname: null,
    image: null,
    genderId: null,
    dateOfBirth: null,
  });
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (tokenData.email == userId) navigate("/account/you");
      const userData = await $getUser(myAccount || userId);
      if (userData.error) navigate("/");
      setUser(userData);
    };
    init();
  }, []);

  const editUser = async () => {
    if (!user.surname) {
      return setErrorMessage("Вы не указали вашу фамилию");
    } else if (!user.name) {
      return setErrorMessage("Вы не указали ваше имя");
    }
    const token = await $editUser(user);
    if (token.error) setErrorMessage(token.error);
    else window.location.assign(`/account/${tokenData.email}`);
  };

  const deleteUser = async () => {
    const result = await $deleteUser();
    if (result.error) setErrorMessage(result.error);
    else navigate("/login");
  };

  const logoutUser = async () => {
    const result = await $logout();
    if (result.error) setErrorMessage(result.error);
    else navigate("/login");
  };

  return (
    <div className="p-[15px] flex  flex-col h-full">
      <div className="border rounded-md flex flex-col relative h-[315px]">
        <div className="absolute top-[60px] left-[50px]">
          <img
            src={user.image}
            className="w-[150px] h-[150px]  rounded-md border bg-white object-cover"
          />
        </div>
        <div className="w-full h-[150px] border-b-1 rounded-md"></div>
        <div className="flex mt-[60px] mx-[50px] justify-between">
          <div className="flex flex-col">
            <span className="text-[28px] my-[0px]">{`${user.surname} ${user.name}`}</span>
            <span className="text-[18px]">{user.email}</span>
            <span className="text-[18px]">
              <span>{user.dateOfBirth} </span>
              <span>
                {user.genderId === "f"
                  ? "female"
                  : user.genderId === "m"
                  ? "male"
                  : ""}
              </span>
            </span>
          </div>
          <div className="flex items-center hidden">
            <div className="flex flex-col text-[20px]">
              <span>Язык</span>
              <select
                name=""
                id=""
                className="border rounded-md px-[7px] py-[2px] outline-0 "
              >
                <option value="">RU</option>
                <option value="">EN</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-md px-[50px] py-[20px] flex flex-col mt-[15px] flex-grow relative">
        <span className="text-[18px] h-10px absolute top-[20px] text-red-800 w-[450px] overflow-hidden text-ellipsis  text-nowrap">
          {errorMessage}
        </span>
        <div className="my-auto">
          <div className="flex justify-between space-x-[50px]">
            <div className="w-full flex space-x-[25px]">
              <CustomInput
                data={user.surname}
                change={(value) => setUser({ ...user, surname: value })}
                read={!myAccount}
              >
                Фамилия
              </CustomInput>
              <CustomInput
                data={user.name}
                change={(value) => setUser({ ...user, name: value })}
                read={!myAccount}
              >
                Имя
              </CustomInput>
            </div>
          </div>
          <div className="flex justify-between space-x-[30px]">
            <div className="w-full">
              <CustomInput
                data={user.image}
                change={(value) => setUser({ ...user, image: value })}
                read={!myAccount}
              >
                URL изображения
              </CustomInput>
            </div>
            <div className=" flex space-x-[25px] w-full">
              <div className="text-[22px]">
                <span>Пол</span>
                <select
                  className="border rounded-md my-[10px] px-[5px] py-[3px] w-[150px] outline-0 "
                  onChange={(e) =>
                    setUser({ ...user, genderId: e.target.value })
                  }
                  value={user.genderId}
                  disabled={!myAccount}
                >
                  <option value="">Не выбран</option>
                  <option value="m">Мужской</option>
                  <option value="f">Женский</option>
                </select>
              </div>
              <CustomInput
                type="date"
                data={user.dateOfBirth}
                change={(value) => setUser({ ...user, dateOfBirth: value })}
                read={!myAccount}
              >
                Дата рождения
              </CustomInput>
            </div>
          </div>
        </div>
        <div className={`ml-auto space-x-[10px] ${!myAccount && "hidden"}`}>
          <CustomButton click={logoutUser}>Выйти</CustomButton>
          <CustomButton click={deleteUser}>Удалить аккаунт</CustomButton>
          <CustomButton click={editUser}>Сохранить</CustomButton>
        </div>
      </div>
    </div>
  );
};
