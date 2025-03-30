import React, { useState } from "react";
import { UPLOAD_IMAGE_PATH } from "../utils/consts";

export const ProjectsListsElement = ({
  image,
  id,
  name,
  checked,
  setChecked,
}) => {
  const [imageFile, setImageFile] = useState(UPLOAD_IMAGE_PATH + image);
  return (
    <li className="my-[5px]">
      <label
        htmlFor={`projectsListCheck-${id}`}
        className="flex items-center justify-between"
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={() => window.location.assign(`/projects/${id}`)}
        >
          <div className="w-[35px] h-[35px]">
            {imageFile ? (
              <img
                src={imageFile}
                onError={() => setImageFile(null)}
                className="rounded-md border w-full h-full object-cover"
              />
            ) : (
              <div className="rounded-md border w-full h-full flex">
                <span className="m-auto text-[18px] leading-0">
                  {name.slice(0, 1)}
                </span>
              </div>
            )}
          </div>

          <span className="text-[24px] ml-[10px] overflow-hidden text-ellipsis text-nowrap w-[160px]">
            {name}
          </span>
        </div>

        <input
          type="checkbox"
          className="w-[26px] h-[26px] rounded-md outline-0"
          checked={checked[id]}
          onClick={(e) => {
            const payload = { ...checked, [id]: e.target.checked };
            setChecked(payload);
            const checkedProjects = [];
            Object.entries(payload).forEach(([key, value]) => {
              if (value) checkedProjects.push(key);
            });
          }}
        />
      </label>
    </li>
  );
};
