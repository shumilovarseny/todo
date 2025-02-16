import React from "react";

export const ModalWinodw = ({ name, children }) => {
  return (
    <div className="flex flex-col w-[230px]  border bg-white rounded-md">
      <div className="border-b-1 flex p-[8px] h-[56px]">
        <span className="text-[26px] m-auto">{name}</span>
      </div>
      <div className="px-[10px] py-[15px]">
        <div>{children}</div>
      </div>
    </div>
  );
};
