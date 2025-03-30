import React, { useState } from "react";
import notificationIcon from "../assets/icons/notification.svg";
import { ImageButtom } from "./ImageButtom";
import { AccountLink } from "./AccountLink";
import { TaskButton } from "./TaskButton";
import { CustomInput } from "./CustomInput";
import { $changeStatusTask } from "../http/tasksApi";

export const Task = ({
  id,
  status,
  name,
  dueDate,
  description,
  priority,
  executor,
  director,
  project,
}) => {
  const [optional, setOptional] = useState(false);
  const [statusTask, changeStatusTask] = useState(status);
  const changeStatus = async () => {
    const task = $changeStatusTask(id, !statusTask);
    if (task.error) setErrorMessage(task.error);
    else changeStatusTask(!statusTask);
  };

  return (
    <div className="my-[5px]">
      <div
        className={`border h-[55px] flex items-center justify-between px-[20px] text-[20px] rounded-md ${
          optional && "rounded-br-none"
        }`}
      >
        <div className="flex items-center mr-[20px]">
          <input
            type="checkbox"
            className="w-[25px] h-[25px]"
            checked={statusTask}
            onClick={() => changeStatus(!statusTask)}
          />
        </div>
        <div className="w-full">{name}</div>
        <div className="w-full">
          <AccountLink
            img={project.image}
            name={project.name}
            link={`/projects/${project.id}`}
          />
        </div>
        <div className="w-full">{dueDate}</div>
        <div>
          <div className="flex justify-between items-center  w-[300px]">
            <div className="w-[150px]">
              <div className="flex outline-0 border rounded-md text-[18px] px-[10px] border-dashed">
                <span className="m-auto">
                  {priority ? "Ключевая" : "Второстепенная"}
                </span>
              </div>
            </div>
            <TaskButton
              name={"Дополнительно"}
              click={() => setOptional(!optional)}
            ></TaskButton>
          </div>
        </div>
      </div>
      <div
        className={`flex border border-t-0 ml-[55px] h-[180px] rounded-b-md ${
          !optional && "hidden"
        }`}
      >
        <div className="border-r-1 px-[10px] w-full">
          <span className="text-[20px]">Комментарий</span>
          <div className=" h-[137px]">
            <textarea
              className="w-full h-full border rounded-md resize-none flex-grow px-[10px] py-[5px] outline-0 text-[14px]"
              value={description}
              disabled
            ></textarea>
          </div>
        </div>
        <div className="w-[400px] px-[10px] overflow-hidden]">
          <span className="text-[20px]">Участники</span>
          <div className="border rounded-md p-[5px] pt-0">
            <span className="text-[20px]">Поручитель</span>
            <div className="w-full">
              <AccountLink
                img={director.image}
                name={director.name}
                link={`/account/${director.email}`}
                className="text-[20px]"
              />
            </div>
            <span className="text-[20px]">Ответственный</span>
            <div className="w-full">
              <AccountLink
                img={executor.image}
                name={executor.name}
                link={`/account/${executor.email}`}
                className="text-[20px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
