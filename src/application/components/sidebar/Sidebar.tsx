import { NavLink, useLocation } from "react-router-dom";
import HomeIcon from "../../assets/HomeIcon";
import MessageIcon from "../../assets/MessageIcon";
import UserIcon from "../../assets/UserIcon";
import TemplateIcon from "../../assets/TemplateIcon";
import TeacherIcon from "../../assets/TeacherIcon";
import { authGetUser } from "../../../domain/services/authService";

function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  const navLinks = [
    {
      label: "Home",
      icon: <HomeIcon />,
      href: "/home",
    },
  ];

  const user = authGetUser();
  if (user.roleId === 1) {
    navLinks.push(
      {
        label: "Users",
        icon: <UserIcon />,
        href: "/users",
      },
      {
        label: "Students",
        icon: <UserIcon />,
        href: "/students",
      },
      {
        label: "Teachers",
        icon: <TeacherIcon />,
        href: "/teachers",
      },
      {
        label: "Messages",
        icon: <MessageIcon />,
        href: "/messages",
      },
      {
        label: "Msg Templates",
        icon: <TemplateIcon />,
        href: "/message-templates",
      }
    );
  } else if (user.roleId === 2) {
    navLinks.push(
      {
        label: "Teachers",
        icon: <TeacherIcon />,
        href: "/teachers",
      },
      {
        label: "Bookings",
        icon: <MessageIcon />,
        href: "/bookings",
      }
    );
  }

  return (
    <nav>
      <ul className="p-0.5">
        {navLinks.map((navLink) => {
          return (
            <li key={navLink.href} className="p-0.5">
              <NavLink
                to={navLink.href}
                className={`flex rounded-md items-center ${
                  pathname.startsWith(navLink.href) ? "bg-blue-200" : ""
                } transition hover:bg-blue-200`}
              >
                <span className="mr-2 w-10 h-10 p-1">{navLink.icon}</span>
                <span>{navLink.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Sidebar;
