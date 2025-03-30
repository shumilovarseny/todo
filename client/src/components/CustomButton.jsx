import React from "react";

export const CustomButton = ({
  children,
  className,
  click,
  text = 22,
  size = [3, 35],
}) => {
  return (
    <button
      className={`border rounded-md cursor-pointer ${className}`}
      style={{ padding: `${size[0]}px ${size[1]}px`, fontSize: text }}
      onClick={() => click()}
    >
      {children}
    </button>
  );
};
