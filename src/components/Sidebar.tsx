import { useState } from "react";
import { IconType } from "react-icons";
import { IoMdAdd } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { Link, Location, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5"; // Hamburger icon
import { FaHome } from "react-icons/fa"; // Home icon

const Sidebar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state for mobile

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <IoMenu />
      </div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
             <Li
              url="/home-sections"
              text="Home Sections"
              Icon={FaHome}
              location={location}
            />
            <Li
              url="/add-home-section"
              text="Add Home Section"
              Icon={IoMdAdd}
              location={location}
            />
            <Li
            url="/aboutus-sections"
            text="About Us Sections"
            Icon={FaHome}
            location={location}
            />
            <Li
            url = "/add-aboutus-section"
            text = "Add About Us Section"
            Icon={IoMdAdd}
            location={location}
            />
          </ul>
        </div>
      </aside>
    </>
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
