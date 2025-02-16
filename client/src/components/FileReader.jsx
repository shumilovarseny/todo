import React, { useRef, useState } from "react";

export const FileReader = ({ children, image, setImage }) => {
  const inputFileRef = useRef(null);
  return (
    <div className="flex flex-col w-full">
      <span className="flex text-[22px] items-center">{children}</span>
      <div className="flex my-[10px]">
        <label className="flex flex-grow">
          <div
            className={`flex w-full border-dashed border-2 rounded-md  text-[20px] py-[3px] bg-gray-100 border-gray-400 cursor-pointer`}
          >
            <span className="m-auto overflow-hidden text-ellipsis text-nowrap">
              {image?.name || "Загрузить"}
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={inputFileRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setImage(file);
            }}
          />
        </label>
        <div className="flex flex-grow">
          <button
            className="border rounded-md px-[10px] text-[16px] ml-[10px] flex-grow cursor-pointer"
            onClick={() => {
              setImage(null);
              inputFileRef.current.value = "";
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};
