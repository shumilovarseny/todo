import React, { useState } from "react";
import { MEMBERS_ROLES } from "../utils/consts";

export const Roles = ({ select, disabl, change, warning }) => {
  const [selectedRole, setSelectedRoles] = useState(select);
  return (
    <select
      className={`border rounded-md py-[1px] px-[5px] text-[16px] pyoutline-0 outline-0 w-[130px] ${
        !disabl && "cursor-pointer"
      }`}
      disabled={disabl}
      value={selectedRole}
      onChange={(e) => {
        const roleId = e.target.value;
        if (roleId == "s") warning();
        else {
          change(roleId);
          setSelectedRoles(roleId);
        }
      }}
    >
      {MEMBERS_ROLES.map(({ value, name }, index) => (
        <option value={value} key={index}>
          {name}
        </option>
      ))}
    </select>
  );
};
