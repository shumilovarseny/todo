import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UPLOAD_IMAGE_PATH } from "../utils/consts";
import { Roles } from "./Roles";

export const Member = ({
  id,
  img,
  name,
  click,
  text,
  changeText,
  alreadyMember,
  roleId,
  account,
  editMemberRole,
  setViewWarning,
  access = false,
  disableChange = false,
}) => {
  const [buttonInfo, setButtonInfo] = useState({ text, disabled: false });
  const [image, setImage] = useState(UPLOAD_IMAGE_PATH + img);
  return (
    <div className="flex border w-full p-[5px] h-[70px] items-center rounded-md justify-between">
      <div className="flex items-start">
        <div className="w-[58px] h-[58px] shrink-0">
          {image ? (
            <img
              src={image}
              onError={() => setImage(null)}
              className="rounded-md border object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full border rounded-md flex">
              <span className="m-auto text-[27px] leading-0">
                {name.slice(0, 1)}
              </span>
            </div>
          )}
        </div>
        <div className="w-[280px] ml-[10px] flex flex-col">
          <span className="overflow-hidden text-ellipsis text-nowrap text-[18px] h-[26px]">
            <Link to={`/account/${id}`}>{name}</Link>
          </span>
          <div>
            {alreadyMember ? (
              <Roles
                disabl={!access || account == id || buttonInfo.disabled}
                select={roleId}
                warning={(value) => setViewWarning(id)}
                change={(value) => editMemberRole(id, value)}
              />
            ) : (
              <span className="overflow-hidden text-ellipsis text-nowrap">
                {id}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        className={`border rounded-md py-[3px] px-[18px] text-[16px] w-[100px] ${
          !buttonInfo.disabled && "cursor-pointer"
        } ${!access && "hidden"}`}
        disabled={buttonInfo.disabled}
        onClick={() => {
          if (!disableChange)
            setButtonInfo({ text: changeText, disabled: true });
          if (!buttonInfo.disabled) click();
        }}
      >
        {buttonInfo.text}
      </button>
    </div>
  );
};
