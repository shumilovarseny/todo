import React, { useEffect, useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { ProjectLink } from "../components/ProjectLink";
import "../scrollbar.css";
import { ProjectSelect } from "../components/ProjectSelect";
import { PROJECTS_SELECT_ACTIVE } from "../utils/consts";
import { $getProjects } from "../http/projectsApi";
import { Link, useNavigate } from "react-router-dom";

export const Projects = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const init = async () => {
      const projectsData = await $getProjects(search, status);
      if (!projectsData.error) setProjects(projectsData);
    };
    init();
  }, [search, status]);
  return (
    <div className="flex flex-col h-full px-[25px] py-[15px]">
      <div className="flex items-end space-x-[20px]">
        <div className="w-[400px]">
          <CustomInput
            placeholder="Поиск"
            data={search}
            change={(value) => setSearch(value)}
          ></CustomInput>
        </div>
        <div className="my-[10px]">
          <ProjectSelect
            options={PROJECTS_SELECT_ACTIVE}
            data={status}
            change={(value) => setStatus(value)}
          />
        </div>
        <div className="my-[10px]">
          <CustomButton click={() => navigate("/projects/new")}>
            Добавить проект
          </CustomButton>
        </div>
      </div>
      <div className="border flex flex-col flex-grow mt-[15px] p-[10px] space-y-[10px] h-0 overflow-auto">
        {projects.map((value, index) => (
          <ProjectLink
            id={value.id}
            name={value.name}
            image={value.image}
            description={value.description}
            status={value.status}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};
