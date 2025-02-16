import React from "react";
import { Link } from "react-router-dom";

export const ProjectLink = ({ id, name, image, description, status }) => {
  return (
    <Link to={`/projects/${id}`}>
      <div className="border px-[20px] rounded-md flex items-center justify-between cursor-pointer">
        <div className="flex items-center text-[22px] space-x-[15px]">
          <img
            src={image}
            alt=""
            className="w-[70px] h-[70px] border rounded-md object-cover"
          />
          <span className="overflow-hidden text-ellipsis w-[170px] text-nowrap">
            {name}
          </span>
        </div>
        <div className="w-[700px] h-[80px] px-[5px] white-space: normal break-words overflow-hidden flex border rounded-md m-[10px]">
          <span>
            {description.length > 380
              ? description.slice(0, 380) + "..."
              : description}
          </span>
        </div>
        <div className="text-[18px] w-[100px]">
          {status ? "Активен" : "Завершен"}
        </div>
      </div>
    </Link>
  );
};
