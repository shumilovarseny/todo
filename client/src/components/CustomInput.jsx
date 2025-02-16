import React from "react";

export const CustomInput = ({
  children,
  placeholder,
  className,
  refer,
  data,
  change,
  read = false,
  type = "text",
}) => {
  return (
    <div className="flex flex-col w-full">
      <span className="flex text-[22px] items-center">{children}</span>
      <input
        type={type}
        className={`border-1 rounded-md my-[10px] text-[20px] py-[3px]  w-full px-[20px] ${className} outline-0`}
        placeholder={placeholder}
        ref={refer}
        value={data}
        onChange={(value) => change(value.target.value)}
        readOnly={read}
      />
    </div>
  );
};
