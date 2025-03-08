import { useState } from "react";
import { IconType } from "react-icons";
import { IoMdAdd } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { MdPets } from "react-icons/md";
import { Link, Location, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5"; // Hamburger icon
import { FaHome } from "react-icons/fa"; // Home icon
import { FaUsers } from "react-icons/fa"; // Icon for sponsors or volunteers
import { FaDonate } from "react-icons/fa"; 

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
            <Li
              url="/our-sponsor-sections"
              text="Our Sponsor Sections"
              Icon={FaUsers}
              location={location}
            />
            {/* About Us - Sponsors */}
            <Li url="/add-sponsor-section" text="Add Sponsor Section" Icon={IoMdAdd} location={location} />

             {/* Adoption Management */}
             <Li url="/manage-adoption" text="Manage Adoption Sections" Icon={FaHome} location={location} />
            <Li url="/add-adoption" text="Add Adoption Section" Icon={IoMdAdd} location={location} />

             {/* Donation Management */}
             {/* <Li
              url="/donation-sections"
              text="Donation Sections"
              Icon={FaDonate}
              location={location}
            /> */}
            <Li
              url="/add-donation-section"
              text="Add Donation Section"
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
