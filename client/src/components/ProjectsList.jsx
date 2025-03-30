import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProjectsListsElement } from "./ProjectsListsElement";

export const ProjectsList = ({ points, setProjects, titleLink }) => {
  const [check, setChecked] = useState({});
  return (
    <div className="flex flex-col flex-grow">
      <h4 className="text-[30px] my-[10px]">
        <Link to={titleLink}>Проекты</Link>
      </h4>
      <ul className="flex flex-col flex-grow h-0 overflow-auto">
        {points.map(({ image, id, name }, index) => (
          <ProjectsListsElement
            image={image}
            id={id}
            name={name}
            key={index}
            checked={check}
            setChecked={(value) => {
              setChecked(value);
              setProjects(value);
            }}
          />
        ))}
      </ul>
    </div>
  );
};
