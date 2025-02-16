import React, { useEffect, useState } from "react";
import { AccountLink } from "../components/AccountLink";
import { CustomButton } from "../components/CustomButton";
import { ProjectSelect } from "../components/ProjectSelect";
import { PROJECT_INFO_SELECT_ACTIVE, UPLOAD_IMAGE_PATH } from "../utils/consts";
import { Member } from "../components/Member";
import { useParams } from "react-router-dom";
import {
  $addMember,
  $createProject,
  $deleteMember,
  $deleteProject,
  $editMemberRole,
  $editProject,
  $getMembers,
  $getProject,
} from "../http/projectsApi";
import { CustomInput } from "../components/CustomInput";
import { useSelector } from "react-redux";
import { FileReader } from "../components/FileReader";
import { handleImageChange } from "../utils/fileReader";
import { $getImage } from "../http/serverApi";
import { ModalWinodw } from "../components/ModalWinodw";

export const ProjectInfo = ({ newProject = false }) => {
  const { projectId } = useParams();
  const account = useSelector((state) => state.token.value.email);
  const [alreadyMember, setAlreadyMember] = useState(true);
  const [search, setSearch] = useState("");
  const [project, setProject] = useState({
    name: "",
    image: "",
    description: "",
    status: true,
  });
  const [director, setDirector] = useState({
    image: "",
    email: "",
    name: "",
    surname: "",
  });
  const [members, setMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [projectFile, setProjectFile] = useState(null);
  const [projectImage, setProjectImage] = useState(null);
  const [viewWarning, setViewWarning] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!newProject) {
        const projectData = await $getProject(projectId);
        if (!projectData.error) {
          setProject(projectData);
          setDirector(projectData.director);
          const image = await $getImage(UPLOAD_IMAGE_PATH + projectData.image);
          setProjectImage(image);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const membersData = await $getMembers(projectId, alreadyMember, search);
      if (!membersData.error) setMembers(membersData);
    };
    init();
  }, [alreadyMember, search]);

  const editProject = async () => {
    if (!project.name) {
      return setErrorMessage("Вы не указали название проекта");
    }
    let result;
    if (newProject)
      result = await $createProject({ ...project, image: projectFile });
    else result = await $editProject({ ...project, image: projectFile });

    if (result.error) setErrorMessage(result.error);
    else if (newProject) window.location.assign(`/projects/${result.id}`);
    else setErrorMessage();
  };

  const addMember = async (email) => {
    const result = await $addMember(email, projectId);
    if (result.error) setErrorMessage(result.error);
    else setErrorMessage("");
  };

  const deleteMember = async (email) => {
    if (account == email && director?.email == email) {
      setErrorMessage(
        "Вы не можете выйти из проекта пока являетесь владельцем"
      );
    } else {
      const result = await $deleteMember(email, projectId);
      if (result.error) setErrorMessage(result.error);
      else if (account == email) window.location.assign(`/projects/`);
      else setErrorMessage("");
    }
  };

  const editMemberRole = async (email, roleId) => {
    const result = await $editMemberRole(email, projectId, roleId);
    if (result.error) setErrorMessage(result.error);
    else if (roleId == "s") window.location.assign(`/projects/${projectId}`);
  };

  const deleteProject = async () => {
    const result = await $deleteProject(projectId);
    if (result.error) setErrorMessage(result.error);
    else window.location.assign(`/projects/`);
  };

  const returnMembers = () => {
    const access = director?.email == account;
    const { mainText, changeText, event } = alreadyMember
      ? { mainText: "Удалить", changeText: "Удален", event: deleteMember }
      : { mainText: "Добавить", changeText: "Добавлен", event: addMember };

    return members.map((data) => {
      const user = alreadyMember ? data.users : data;
      if (!user) return;
      const { image, surname, name, email } = user;
      const roleId = alreadyMember ? data.roleId : null;
      return (
        <Member
          img={image}
          name={`${surname} ${name}`}
          id={email}
          key={email}
          account={account}
          access={account == email ? true : access}
          text={account == email ? "Выйти" : mainText}
          changeText={changeText}
          disableChange={account == email}
          alreadyMember={alreadyMember}
          roleId={roleId}
          editMemberRole={editMemberRole}
          setViewWarning={setViewWarning}
          click={() => event(email)}
        />
      );
    });
  };

  return (
    <div className=" p-[25px]  flex flex-col h-full w-full">
      <div className="flex border rounded-md p-[20px] items-center justify-between">
        <div className="flex items-center">
          <div className="w-[200px] h-[200px] shrink-0">
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
                  {project.name.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-[25px] flex flex-col">
            <h3 className="text-[34px] overflow-hidden text-ellipsis text-nowrap w-[500px]">
              {project.name}
            </h3>
            <span className={`text-[22px] my-[5px]  ${newProject && "hidden"}`}>
              Владелец
            </span>
            <AccountLink
              img={director.image}
              name={`${director.surname} ${director.name}`}
              className={`text-[20px] w-[400px]  ${newProject && "hidden"}`}
              textWidth={700}
              link={`/account/${director.email}`}
            />
            <span className="text-[22px] mt-[5px]">Статус</span>
            <span className="text-[20px]">
              {project.status ? "Активен" : "Завершен"}
            </span>
          </div>
        </div>
        <div
          className={`space-x-[15px] ${
            director?.email != account && !newProject && "hidden"
          }`}
        >
          <CustomButton click={deleteProject}>Удалить</CustomButton>
          <CustomButton click={editProject}>Сохранить</CustomButton>
        </div>
      </div>
      <div className="flex mt-[20px] space-x-[15px] flex-grow">
        <div className="flex space-x-[15px] flex-grow flex-col relative">
          <span className="text-[18px] h-10px absolute top-[-19px] text-red-800 w-[500px] overflow-hidden text-ellipsis  text-nowrap">
            {errorMessage}
          </span>
          <h4 className="text-[26px]">
            {director.email == account || newProject
              ? "Информация"
              : "Описание"}
          </h4>
          <div className="flex  space-x-[15px] flex-grow">
            <div
              className={`flex flex-col flex-grow border rounded-md p-[10px] mt-[10px] ${
                !(director.email == account || newProject) && "hidden"
              }`}
            >
              <div>
                <span className="flex text-[22px] items-center">Статус</span>
                <div className="my-[10px]">
                  <ProjectSelect
                    options={PROJECT_INFO_SELECT_ACTIVE}
                    data={project.status}
                    dis={director?.email != account}
                    change={(value) =>
                      setProject({
                        ...project,
                        status: value == "true" ? true : false,
                      })
                    }
                  />
                </div>
              </div>
              <CustomInput
                data={project.name}
                change={(value) => setProject({ ...project, name: value })}
                read={!newProject && director?.email != account}
              >
                Название
              </CustomInput>

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
            <div className="flex flex-col flex-grow">
              <textarea
                className="w-full border rounded-md resize-none mt-[10px] flex-grow p-[10px] outline-0"
                value={project.description}
                placeholder="Описание"
                disabled={!newProject && director?.email != account}
                onChange={(value) =>
                  setProject({ ...project, description: value.target.value })
                }
              ></textarea>
            </div>
          </div>
        </div>
        <div className={`w-[550px] flex flex-col ${newProject && "hidden"}`}>
          <div className="flex justify-between">
            <h4 className="text-[26px] ">Участники</h4>
            <div
              className={`flex space-x-[0px] ${
                director?.email != account && "hidden"
              }`}
            >
              <CustomButton click={() => setAlreadyMember(true)}>
                Список
              </CustomButton>
              <CustomButton
                click={() => setAlreadyMember(false)}
                className={`ml-[10px]`}
              >
                Добавить
              </CustomButton>
            </div>
          </div>

          <CustomInput
            className="h-[45px]"
            placeholder="Поиск"
            data={search}
            change={(value) => setSearch(value)}
          ></CustomInput>
          <div className="flex flex-col border rounded-md p-[5px] flex-grow h-[0px] overflow-auto space-y-[10px] relative">
            <div
              className={`absolute  left-[150px] top-[15px] ${
                !viewWarning && "hidden"
              }`}
            >
              <ModalWinodw name="Предупреждение">
                <div className="flex flex-col border py-[5px] border-dashed">
                  <span className="text-[18px] m-auto text-center">
                    Вы уверены, что хотите передать права владельца проекта?
                  </span>
                  <div className="flex mt-[5px] space-x-[10px] m-auto">
                    <CustomButton
                      text={18}
                      size={[1, 15]}
                      click={() => editMemberRole(viewWarning, "s")}
                    >
                      Да
                    </CustomButton>
                    <CustomButton
                      text={18}
                      size={[1, 15]}
                      click={() => setViewWarning(null)}
                    >
                      Нет
                    </CustomButton>
                  </div>
                </div>
              </ModalWinodw>
            </div>
            {returnMembers()}
          </div>
        </div>
      </div>
    </div>
  );
};
