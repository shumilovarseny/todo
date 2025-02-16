import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Link, Outlet, useLocation } from "react-router-dom";
import notificationIcon from "./assets/icons/notification.svg";
import { CustomList } from "./components/CustomList";
import { TASKS_TABS, UPLOAD_IMAGE_PATH } from "./utils/consts";
import { ProjectsList } from "./components/ProjectsList";
import { useSelector } from "react-redux";
import { $getProjects } from "./http/projectsApi";
import { useDispatch } from "react-redux";
import { setFilter } from "./reducers/filterReducer";

function App() {
  const location = useLocation();
  const [title, setTitle] = useState("Задачи");

  const tokenData = useSelector((state) => state.token.value);
  const [projects, setProjects] = useState([]);
  const dispatch = useDispatch();

  const [image, setImage] = useState(UPLOAD_IMAGE_PATH + tokenData.image);
  useEffect(() => {
    const init = async () => {
      const projectsData = await $getProjects("", "active");
      if (!projectsData.error) setProjects(projectsData);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/projects")) title = setTitle("Проекты");
      else if (pathname.startsWith("/account")) title = setTitle("Аккаунт");
      else title = setTitle("Задачи");
    };
    init();
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-full h-full ">
      <header className="flex border h-[80px]">
        <div className="flex w-[300px] flex-shrink-0 border-r-1">
          <h1 className="text-[35px] font-light my-auto mx-[40px]">TODO</h1>
        </div>
        <div className="flex justify-between w-full items-center px-[20px]">
          <h2 className="border text-[30px] font-light rounded-md px-[30px]">
            {title}
          </h2>
          <div className="flex space-x-[10px]">
            <button className="w-[44px] h-[44px] hidden">
              <img src={notificationIcon} alt="" />
            </button>
            <Link to="/account/you">
              <button className="w-[44px] h-[44px] cursor-pointer">
                {image ? (
                  <img
                    src={image}
                    onError={() => setImage(null)}
                    className="rounded-4xl border w-full h-full object-cover"
                  />
                ) : (
                  <div className="rounded-4xl border w-full h-full flex">
                    <span className="m-auto text-[22px] leading-0">
                      {tokenData.surname.slice(0, 1)}
                    </span>
                  </div>
                )}
              </button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex flex-1 border-l-1">
        <aside className="flex flex-col w-[300px] flex-shrink-0 border-r-1 py-[10px] px-[25px] flex-grid">
          <CustomList title="Задачи" points={TASKS_TABS} titleLink="/today" />
          <ProjectsList
            points={projects}
            setProjects={(value) => dispatch(setFilter(value))}
            titleLink="/projects"
          />
        </aside>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
