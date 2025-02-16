import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UPLOAD_IMAGE_PATH } from "../utils/consts";

export const AccountLink = ({
  img,
  name,
  className,
  link,
  size = 35,
  textWidth = 170,
}) => {
  const [image, setImage] = useState(img);
  return (
    <Link to={link}>
      <div className={`flex items-start ${className}`}>
        <div style={{ width: size, height: size }} className="shrink-0">
          {image ? (
            <img
              src={UPLOAD_IMAGE_PATH + image}
              onError={() => {
                setImage(null);
              }}
              className="rounded-md border object-cover w-full h-full "
            />
          ) : (
            <div className="rounded-md border w-full h-full flex">
              <span className={`m-auto text-[${size / 2}px] leading-0`}>
                {name ? name?.slice(0, 1) : ""}
              </span>
            </div>
          )}
        </div>
        <span
          className={`ml-[10px] overflow-hidden text-ellipsis text-nowrap`}
          style={{ width: textWidth }}
        >
          {name ? name : "Не выбран"}
        </span>
      </div>
    </Link>
  );
};
