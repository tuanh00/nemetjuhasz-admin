import { IconType } from "react-icons";
import { IoMdAdd } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { Link, Location, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside>
      <div>
        <h5>Dashboard</h5>
        <ul>
          <Li
            url="/dashboard"
            text="Dashboard"
            Icon={IoDesktop}
            location={location}
          />
          <Li url="/pet" text="Pets" Icon={MdPets} location={location} />
          <Li
            url="/add-pet"
            text="Add Pet"
            Icon={IoMdAdd}
            location={location}
          />
          {/* <Li
            url="/update-pet"
            text="Edit Pet"
            Icon={MdEdit}
            location={location}
          /> */}
          {/* <Li
            url="/delete-pet"
            text="Delete Pet"
            Icon={MdDelete}
            location={location}
          /> */}
        </ul>
      </div>
    </aside>
  );
};

interface LiProps {
  url: string;
  text: string;
  location: Location;
  Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url)
        ? "rgba(0,115,255,0.1)"
        : "white",
    }}
  >
    <Link to={url}>
      <Icon />
      <span>{text}</span>
    </Link>
  </li>
);

export default Sidebar;
