import React from "react";
import { ModalWinodw } from "./ModalWinodw";
import { CustomButton } from "./CustomButton";

export const Warning = ({ message, agree, disagree, hide }) => {
  return (
    <div hidden={hide}>
      <ModalWinodw name="Предупреждение">
        <div className="flex flex-col border py-[5px] border-dashed">
          <span className="text-[18px] m-auto text-center">{message}</span>
          <div className="flex mt-[5px] space-x-[10px] m-auto">
            <CustomButton text={18} size={[1, 15]} click={agree}>
              Да
            </CustomButton>
            <CustomButton text={18} size={[1, 15]} click={disagree}>
              Нет
            </CustomButton>
          </div>
        </div>
      </ModalWinodw>
    </div>
  );
};
