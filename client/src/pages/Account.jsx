import React, { useEffect, useRef, useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  $changeEmail,
  $changePassword,
  $deleteUser,
  $editUser,
  $getUser,
} from "../http/usersApi";
import { useSelector } from "react-redux";
import { $logout } from "../http/authorizationApi";
import { FileReader } from "../components/FileReader";
import { handleImageChange } from "../utils/fileReader";
import { UPLOAD_IMAGE_PATH } from "../utils/consts";
import { Warning } from "../components/Warning";
import { ModalWinodw } from "../components/ModalWinodw";

export const Account = ({ myAccount = false }) => {
  const { userId } = useParams();
  const tokenData = useSelector((state) => state.token.value);

  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    name: "",
    surname: "",
    image: "",
    genderId: "",
    dateOfBirth: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorEmailMessage, setErrorEmailMessage] = useState(null);
  const [errorPasswordMessage, setErrorPasswordMessage] = useState(null);
  const [projectFile, setProjectFile] = useState(null);
  const [projectImage, setProjectImage] = useState(null);
  const [viewDeleteUserWarning, setViewDeleteUserWarning] = useState(null);
  const [activeChangePassword, setActiveChangePassword] = useState(false);
  const [activeChangeEmail, setActiveChangeEmail] = useState(false);
  const newEmail = useRef(null);
  const password = useRef(null);
  const newPassword = useRef(null);
  const confirmPassword = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (tokenData.email == userId) navigate("/account/you");
      const userData = await $getUser(myAccount || userId);
      if (userData.error) navigate("/");
      setUser(userData);
      setProjectImage(UPLOAD_IMAGE_PATH + userData.image);
    };
    init();
  }, []);

  const editUser = async () => {
    if (!user.surname) {
      return setErrorMessage("Вы не указали вашу фамилию");
    } else if (!user.name) {
      return setErrorMessage("Вы не указали ваше имя");
    }
    const token = await $editUser({ ...user, image: projectFile });
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

  const changeEmail = async (newEmail) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return setErrorEmailMessage("Некорректный email");
    }
    const result = await $changeEmail(newEmail);
    if (result.error) setErrorEmailMessage(result.error);
    else window.location.assign(`/account/${newEmail}`);
  };

  const changePassword = async (password, newPassword, confirmPassword) => {
    if (
      password.length < 8 ||
      newPassword.length < 8 ||
      confirmPassword.length < 8
    )
      return setErrorPasswordMessage(
        "Пароль должен состоять хотя бы из 8 символов"
      );
    if (newPassword != confirmPassword) {
      return setErrorPasswordMessage("Подтвердите пароль");
    }
    const result = await $changePassword(password, newPassword);
    if (result.error) setErrorPasswordMessage(result.error);
    else window.location.assign(`/account/${tokenData.email}`);
  };

  return (
    <div className="p-[15px] flex  flex-col h-full">
      <div className="border rounded-md flex flex-col h-[315px]">
        <div className="w-full border-b-1 rounded-md  py-[20px] px-[50px] flex justify-between">
          <div className="w-[150px] h-[150px] top-[60px] left-[50px] my-auto">
            {projectImage ? (
              <img
                src={projectImage}
                className={`w-full h-full object-cover border rounded-md ${projectImage}`}
                onError={() => {
                  setProjectImage(null);
                }}
              />
            ) : (
              <div className="w-full h-full border rounded-md flex">
                <span className="m-auto text-[100px] leading-0">
                  {user.surname.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
          <div className="flex text-[20px]"></div>
        </div>
        <div className="flex my-auto m-[20px] mx-[50px] justify-between">
          <div className="flex flex-col ">
            <div className="flex flex-col my-auto ">
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
          </div>
          <div className="flex flex-col space-y-[10px]">
            <div
              className={`space-x-[10px] items-center flex m-auto relative ${
                !myAccount && "hidden"
              }`}
            >
              <div className={`absolute top-[-200px]`}>
                <Warning
                  hide={!viewDeleteUserWarning}
                  message="Вы уверены, что хотите удалить аккаунт?"
                  agree={() => deleteUser()}
                  disagree={() => setViewDeleteUserWarning(false)}
                />
              </div>
              <CustomButton
                click={() => setViewDeleteUserWarning(true)}
                className="w-[230px]"
              >
                Удалить аккаунт
              </CustomButton>
              <CustomButton click={logoutUser}>Выйти</CustomButton>
            </div>
          </div>
        </div>
      </div>
      <div className="border rounded-md px-[50px] py-[20px] flex flex-col mt-[15px] flex-grow relative">
        <span className="text-[18px] h-10px absolute top-[7px] text-red-800 w-[450px] overflow-hidden text-ellipsis  text-nowrap">
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
              <FileReader
                image={projectFile}
                setImage={(value) => {
                  setProjectFile(value);
                  handleImageChange(value, setProjectImage);
                }}
              >
                Изображение
              </FileReader>
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

          <div
            className={`flex  space-x-[10px] justify-end my-[10px] ${
              !myAccount && "hidden"
            }`}
          >
            <div className="relative">
              <CustomButton
                click={() => setActiveChangeEmail(!activeChangeEmail)}
                className="w-[230px]"
              >
                {activeChangeEmail ? "Отменить" : "Сменить почту"}
              </CustomButton>
              <div
                className={`absolute top-[-215px] ${
                  !activeChangeEmail && "hidden"
                }`}
              >
                <ModalWinodw name="Смена почты">
                  <div className="relative">
                    <span className="text-[18px] h-10px absolute top-[-17px] text-red-800 w-[200px] overflow-hidden text-ellipsis text-nowrap  cursor-help">
                      {errorEmailMessage}
                    </span>
                    <CustomInput placeholder="Новая почта" refer={newEmail} />
                    <div className="flex py-[10px]">
                      <CustomButton
                        className="m-auto"
                        click={() => changeEmail(newEmail.current.value)}
                      >
                        Сохранить
                      </CustomButton>
                    </div>
                  </div>
                </ModalWinodw>
              </div>
            </div>
            <div className="relative">
              <CustomButton
                click={() => setActiveChangePassword(!activeChangePassword)}
                className="w-[230px]"
              >
                {activeChangePassword ? "Отменить" : "Сменить пароль"}
              </CustomButton>
              <div
                className={`absolute top-[-330px] ${
                  !activeChangePassword && "hidden"
                }`}
              >
                <ModalWinodw name="Смена пароля">
                  <div className="relative">
                    <span className="text-[18px] h-10px absolute top-[-17px] text-red-800 w-[200px] overflow-hidden text-ellipsis  text-nowrap cursor-help">
                      {errorPasswordMessage}
                    </span>
                    <CustomInput
                      placeholder="Старый пароль "
                      refer={password}
                    />
                    <CustomInput
                      placeholder="Новый пароль"
                      refer={newPassword}
                    />
                    <CustomInput
                      placeholder="Подтверждение"
                      refer={confirmPassword}
                    />
                    <div className="flex py-[10px]">
                      <CustomButton
                        className="m-auto"
                        click={() =>
                          changePassword(
                            password.current.value,
                            newPassword.current.value,
                            confirmPassword.current.value
                          )
                        }
                      >
                        Сохранить
                      </CustomButton>
                    </div>
                  </div>
                </ModalWinodw>
              </div>
            </div>
            <CustomButton click={editUser}>Сохранить</CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};
