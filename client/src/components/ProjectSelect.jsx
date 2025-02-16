import React from "react";

export const ProjectSelect = ({
  options,
  className,
  data,
  change,
  dis = false,
}) => {
  return (
    <select
      className={`border rounded-md w-full py-[3px] px-[5px] text-[22px] pyoutline-0 outline-0 ${className} ${
        !dis && "cursor-pointer"
      }`}
      value={data}
      onChange={(value) => change(value.target.value)}
      disabled={dis}
    >
      {options.map(({ value, name }, index) => (
        <option value={value} key={index}>
          {name}
        </option>
      ))}
    </select>
  );
};
