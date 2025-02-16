import React from "react";

export const TaskButton = ({ name, click, className }) => {
  return (
    <button
      className={`border rounded-md py-[0px] px-[5px] w-[135px] text-[18px] cursor-pointer ${className}`}
      onClick={click}
    >
      {name}
    </button>
  );
};
