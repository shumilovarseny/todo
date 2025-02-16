import React from "react";

export const ImageButtom = ({ img, click }) => {
  return (
    <button className="w-[30px] h-[30px] cursor-pointer" onClick={click}>
      <img src={img} alt="" className="object-cover" />
    </button>
  );
};
