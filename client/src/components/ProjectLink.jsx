import React from "react";
import { Link } from "react-router-dom";
import { UPLOAD_IMAGE_PATH } from "../utils/consts";

export const ProjectLink = ({ id, name, image, description, status }) => {
  return (
    <Link to={`/projects/${id}`}>
      <div className="border px-[20px] rounded-md flex items-center justify-between cursor-pointer">
        <div className="flex items-center text-[22px] space-x-[15px]">
          <div className="w-[70px] h-[70px]">
            {image ? (
              <img
                src={UPLOAD_IMAGE_PATH + image}
                alt=""
                className="w-full h-full border rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-full border rounded-md flex">
                <span className="m-auto text-[27px] leading-0">
                  {name.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
          <span className="overflow-hidden text-ellipsis w-[170px] text-nowrap">
            {name}
          </span>
        </div>
        <div className="w-[700px] h-[80px] px-[5px] white-space: normal break-words overflow-hidden flex border rounded-md m-[10px]">
          <span>
            {description && description != "null"
              ? description.length > 380
                ? description.slice(0, 380) + "..."
                : description
              : "Описание отсутсвует"}
          </span>
        </div>
        <div className="text-[18px] w-[100px]">
          {status ? "Активен" : "Завершен"}
        </div>
      </div>
    </Link>
  );
};
