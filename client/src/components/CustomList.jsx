import React from "react";
import { Link } from "react-router-dom";

export const CustomList = ({ title, points, titleLink }) => {
  return (
    <div>
      <h4 className="text-[30px] my-[10px]">
        <Link to={titleLink}>{title}</Link>
      </h4>
      <ul>
        {points.map(({ link, name }, index) => (
          <li className="flex items-center" key={index}>
            <Link to={`/${link}`}>
              <span className="text-[22px]">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
