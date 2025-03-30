import React, { useEffect, useRef, useState } from "react";
import {
  FILTERS,
  MODAL_WINDOW_BUTTON,
  SORT_TASKS_OPTIONS,
  TASKS_TABS,
  UPLOAD_IMAGE_PATH,
} from "../utils/consts";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import notificationIcon from "../assets/icons/notification.svg";
import sortIcon from "../assets/icons/sort.svg";
import { CustomSelect } from "../components/CustomSelect";
import { ImageButtom } from "../components/ImageButtom";
import { Task } from "../components/Task";
import { ModalWinodw } from "../components/ModalWinodw";
import { AccountLink } from "../components/AccountLink";
import { ProjectLink } from "../components/ProjectLink";
import { TaskButton } from "../components/TaskButton";
import { $getMembers, $getProjects } from "../http/projectsApi";
import { $addExecutors, $createTask, $getTasks } from "../http/tasksApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const Tasks = () => {
  const { filter } = useParams();
  const navigate = useNavigate();
  const projectsFilter = useSelector((state) => state.filter.value);

  if (!FILTERS.includes(filter)) navigate("/today");

  const [windowActive, setWindowActive] = useState(null);

  const name = useRef();
  const date = useRef();
  const time = useRef();
  const description = useRef();
  const priority = useRef();

  const [searchTasks, setSearchTasks] = useState("");
  const [sortData, setSortData] = useState("name");
  const [direction, setDirection] = useState(true);
  const [type, setType] = useState("executor");

  const [projectsSearch, setProjectsSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    image: null,
    name: null,
    id: null,
  });

  const [executorsSearch, setExecutorsSearch] = useState("");
  const [executors, setExecutors] = useState([]);
  const [selectedExcutor, setSelectedExcutor] = useState({
    id: null,
    users: {
      image: null,
      name: null,
      surname: null,
      email: null,
    },
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const init = async () => {
      const projectsData = await $getProjects(projectsSearch, "active");
      if (!projectsData.error) setProjects(projectsData);
      if (projectsData.length) setSelectedProject(projectsData[0]);
      else
        setSelectedProject({
          image: null,
          name: null,
          id: null,
        });
    };
    init();
  }, [projectsSearch]);

  useEffect(() => {
    const init = async () => {
      if (selectedProject.id) {
        const membersData = await $getMembers(
          selectedProject.id,
          true,
          executorsSearch,
          true
        );
        if (!membersData.error) setExecutors(membersData);
        if (membersData.length) setSelectedExcutor(membersData[0]);
        else
          setSelectedExcutor({
            id: null,
            users: {
              image: null,
              name: null,
              surname: null,
              email: null,
            },
          });
      } else {
        setExecutors([]);
        setSelectedExcutor({
          id: null,
          users: {
            image: null,
            name: null,
            surname: null,
            email: null,
          },
        });
      }
    };
    init();
  }, [selectedProject, executorsSearch]);

  useEffect(() => {
    const init = async () => {
      if (!projectsFilter.length) setTasks([]);
      const tasks = await $getTasks(
        projectsFilter,
        searchTasks,
        sortData,
        direction ? "asc" : "desc",
        filter,
        type
      );
      if (tasks.error) setTasks([]);
      else setTasks(tasks);
    };
    init();
  }, [searchTasks, sortData, direction, type, filter, projectsFilter]);

  const createTask = async () => {
    const nameData = name.current.value;
    if (!nameData) return setErrorMessage("Вы не указали название задания");
    const dueDate = `${date.current.value} ${time.current.value}`;
    if (!date.current.value || !time.current.value)
      return setErrorMessage("Вы не указали срок сдачи");
    const descriptionData = description.current.value;
    const priorityData = priority.current.value;
    const projectId = selectedProject.id;
    if (!nameData) return setErrorMessage("Вы не указали проект");
    const memberId = selectedExcutor.id;
    if (!nameData) return setErrorMessage("Вы не указали ответсвенного");
    const task = await $createTask(
      nameData,
      dueDate,
      descriptionData,
      priorityData,
      projectId
    );
    if (task.error) return setErrorMessage(task.error);
    const executor = await $addExecutors(task.id, memberId);
    if (executor.error) return setErrorMessage(executor.error);
    window.location.assign("/planned");
  };

  return (
    <div className="px-[25px] py-[10px] h-full flex flex-col">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-[30px] my-[10px]">
            {TASKS_TABS.map(({ name, link }) => {
              if (filter == link) return name;
            })}
          </h4>
          <div className="space-x-[15px]">
            <CustomButton
              className="h-[40px]"
              click={() => setType("executor")}
            >
              Назначенные мне
            </CustomButton>
            <CustomButton
              className="h-[40px]"
              click={() => setType("director")}
            >
              Порученные мной
            </CustomButton>
          </div>
        </div>
        <div className="mt-[20px] flex flex-col">
          <CustomSelect
            name="Сортировка:"
            options={SORT_TASKS_OPTIONS}
            data={sortData}
            change={(value) => setSortData(value)}
          >
            <button
              className="w-[25px] h-[25px] cursor-pointer"
              onClick={() => setDirection(!direction)}
            >
              <img src={sortIcon} alt="" className="object-cover" />
            </button>
          </CustomSelect>
          <CustomInput
            placeholder="Поиск"
            className="h-[45px]"
            data={searchTasks}
            change={(value) => setSearchTasks(value)}
          ></CustomInput>
        </div>
        <div>
          <div className="relative">
            <span className="h-10px absolute top-[-23px] text-red-800 w-[450px] overflow-hidden text-ellipsis  text-nowrap">
              {errorMessage}
            </span>
          </div>
          <div className="relative flex items-center mt-[10px]">
            <input
              type="text"
              className=" w-full border text-[22px] px-[10px] py-[3px] rounded-t-md h-[50px] outline-0"
              placeholder="Добавить задачу"
              ref={name}
            />
          </div>
          <div className="border text-[22px] px-[10px] py-[3px] rounded-b-md border-t-0 h-[50px] items-center flex justify-between">
            <div className="flex space-x-[5px] relative">
              {MODAL_WINDOW_BUTTON.map(({ value, name }, index) => (
                <TaskButton
                  key={index}
                  name={name}
                  click={() => {
                    if (value == windowActive) setWindowActive(null);
                    else setWindowActive(value);
                  }}
                />
              ))}
              <select
                className="outline-0 border rounded-md text-[18px]"
                ref={priority}
              >
                <option value={true}>Ключевая</option>
                <option value={false}>Второстепенная</option>
              </select>
              <div
                className={`absolute top-[30px] left-[0px] ${
                  windowActive != "dueDate" && "hidden"
                }`}
              >
                <ModalWinodw name="Срок">
                  <div className="flex flex-col">
                    <span>Дата</span>
                    <input
                      type="date"
                      className="w-[210px] h-[20px]"
                      ref={date}
                    />
                    <span className="mt-[15px]">Время</span>
                    <input
                      type="time"
                      className="w-[210px] h-[20px]"
                      ref={time}
                    />
                  </div>
                </ModalWinodw>
              </div>

              <div
                className={`absolute top-[30px] left-[0px] ${
                  windowActive != "project" && "hidden"
                }`}
              >
                <ModalWinodw name="Проект">
                  <div>
                    <AccountLink
                      img={selectedProject.image}
                      name={selectedProject.name}
                      link={`/projects/${selectedProject.id}`}
                      setImage={(value) =>
                        setSelectedProject({
                          ...selectedProject,
                          image: value,
                        })
                      }
                    />
                    <CustomInput
                      data={projectsSearch}
                      change={(value) => setProjectsSearch(value)}
                      placeholder="Поиск"
                    ></CustomInput>
                    <div>
                      <select
                        className={`border-1 rounded-md text-[20px] py-[3px]  w-full px-[20px] outline-0`}
                        onChange={(value) => {
                          const option =
                            value.target.childNodes[value.target.value];
                          setSelectedProject({
                            name: option.getAttribute("data-name"),
                            id: option.getAttribute("data-id"),
                            image: option.getAttribute("data-image"),
                          });
                        }}
                      >
                        {projects.map(({ image, name, id }, index) => (
                          <option
                            value={index}
                            data-id={id}
                            data-name={name}
                            data-image={image}
                            key={index}
                            selected={id == selectedProject}
                          >
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </ModalWinodw>
              </div>

              <div
                className={`absolute top-[30px] left-[0px] ${
                  windowActive != "executor" && "hidden"
                }`}
              >
                <ModalWinodw name="Ответственный">
                  <div>
                    <AccountLink
                      img={selectedExcutor.users.image}
                      name={
                        !selectedExcutor.users.surname ||
                        !selectedExcutor.users.name
                          ? null
                          : `${selectedExcutor.users.surname} ${selectedExcutor.users.name}`
                      }
                      link={`/account/${selectedExcutor.id}`}
                      setImage={(value) => {
                        const executor = { ...selectedExcutor };
                        executor.users.image = value;
                        setSelectedExcutor(executor);
                      }}
                    />
                    <CustomInput
                      data={executorsSearch}
                      change={(value) => setExecutorsSearch(value)}
                      placeholder="Поиск"
                    ></CustomInput>
                    <div>
                      <select
                        className={`border-1 rounded-md text-[20px] py-[3px]  w-full px-[20px] outline-0`}
                        onChange={(value) => {
                          const option =
                            value.target.childNodes[value.target.value];
                          setSelectedExcutor({
                            id: option.getAttribute("data-id"),
                            users: {
                              name: option.getAttribute("data-name"),
                              surname: option.getAttribute("data-surname"),
                              email: option.getAttribute("data-email"),
                              image: option.getAttribute("data-image"),
                            },
                          });
                        }}
                      >
                        {executors.map(({ users, id }, index) => (
                          <option
                            value={index}
                            data-id={id}
                            data-email={users.email}
                            data-surname={users.surname}
                            data-name={users.name}
                            data-image={users.image}
                            key={index}
                            selected={users.email == selectedExcutor}
                          >
                            {`${users.surname} ${users.name}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </ModalWinodw>
              </div>

              <div
                className={`absolute top-[30px] left-[0px] ${
                  windowActive != "description" && "hidden"
                }`}
              >
                <ModalWinodw name="Комментарий">
                  <textarea
                    name=""
                    id=""
                    className="w-full border rounded-md resize-none mt-[10px] h-[200px] p-[10px] outline-0"
                    ref={description}
                  ></textarea>
                </ModalWinodw>
              </div>
            </div>
            <TaskButton name="Добавить" click={createTask}></TaskButton>
          </div>
        </div>
      </div>

      <div className="mt-[20px] border-y-1 w-full flex flex-col flex-grow h-[0px] overflow-y-auto">
        {tasks.map(
          (
            {
              id,
              status,
              name,
              dueDate,
              description,
              priority,
              project,
              director,
              executor,
            },
            index
          ) => {
            const dateObject = new Date(dueDate);

            return (
              <Task
                id={id}
                status={status}
                name={name}
                dueDate={`${dateObject.toLocaleDateString()} ${dateObject.toLocaleTimeString()}`}
                description={description}
                priority={priority}
                executor={executor}
                director={director}
                project={project}
                key={index}
              ></Task>
            );
          }
        )}
      </div>
    </div>
  );
};
