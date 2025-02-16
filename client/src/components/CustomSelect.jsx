import React from "react";

export const CustomSelect = ({
  name,
  options = [],
  children,
  data,
  change,
}) => {
  return (
    <div className="ml-auto text-[20px] items-center flex">
      <span>{name}</span>
      <select
        className="outline-0 ml-[10px]"
        value={data}
        onChange={(event) => change(event.target.value)}
      >
        {options.map(({ value, name }, index) => (
          <option value={value} key={index}>
            {name}
          </option>
        ))}
      </select>
      {children}
    </div>
  );
};
