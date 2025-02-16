import React, { useState } from "react";
import notificationIcon from "../assets/icons/notification.svg";
import { ImageButtom } from "./ImageButtom";
import { AccountLink } from "./AccountLink";
import { TaskButton } from "./TaskButton";
import { CustomInput } from "./CustomInput";

export const Task = ({
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
            checked={!status}
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
        <div className="flex space-x-[10px] items-center">
          <select
            className="outline-0 border rounded-md text-[18px]"
            disabled
            value={priority}
          >
            <option value={true}>Ключевая</option>
            <option value={false}>Второстепенная</option>
          </select>
          <TaskButton
            name={"Дополнительно"}
            click={() => setOptional(!optional)}
          ></TaskButton>
          {/* <TaskButton
            name={"Изменить"}
            className="bg-gray-100 text-gray-400"
          ></TaskButton>
          <TaskButton
            name={"Удалить"}
            className="bg-gray-100 text-gray-400"
          ></TaskButton> */}
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
