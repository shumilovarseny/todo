import React from "react";
import { Account } from "../pages/Account";
import { useSelector } from "react-redux";

export const YourAccount = () => {
  const tokenData = useSelector((state) => state.token.value);
  return <Account myAccount={tokenData.email}></Account>;
};
