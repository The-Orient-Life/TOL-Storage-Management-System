/* eslint-disable react/prop-types */
import { useState } from "react";
import logo from "../assets/logo.png";
import {
  FaHome,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaSurprise
} from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { BiCube } from "react-icons/bi";
import { GrDocumentText } from "react-icons/gr";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { MdOutlineSettings } from "react-icons/md";
import { LuMessageSquare } from "react-icons/lu";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function Navbar({ isSidebarOpen, setSidebarOpen }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const navigate = useNavigate();

  const OnAddBtnClick = () => {
     
    console.log("Add Button Clicked")
    navigate('/productadd')

  }

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, link: "/dashboard" },
    // { name: "Profile", icon: <FaUser />, link: "/profile" },
    // {
    //   name: "Datastore",
    //   icon: <TbWorld />,
    //   dropdown: [
    //     { name: "Account", link: "/settings/account" },
    //     { name: "Privacy", link: "/settings/privacy" },
    //   ],
    // },
    {
      name: "Product",
      icon: <BiCube />,
      dropdown: [
        { name: "View Product", link: "/productview" },
        { name: "Returns", link: "/productreturn" },
      ],
    },
    {
      name: "Customer",
      icon: <FaUser />,
      dropdown: [
        { name: "Search Customer", link: "/customer" },
        { name: "New User", link: "/adduser" },
        // { name: "Customer List", link: "/customerlist" }
      ],
    },
    {
      name: "Transactions",
      icon: <FaEdit />,
      dropdown: [
        { name: "New Purchase", link: "/newpurchase" },
        { name: "Purchase History", link: "/purchasehistory" },
      ],
    },
    {
      name: "Reports",
      icon: <HiOutlineSquare3Stack3D />,
      dropdown: [
        { name: "Weekly Sales", link: "/settings/account" },
        { name: "Monthly Sales", link: "/settings/privacy" },
      ],
    },
    
  ];

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="#" className="flex ms-2 md:me-24">
                <img src={logo} className="h-8 me-3" alt="FlowBite Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap hidden sm:block dark:text-black ">
                  TOL System
                </span>
              </a>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 bg-blue-500 text-white font-medium rounded-full px-5 py-2 shadow-lg hover:bg-blue-600 transition"
             onClick={OnAddBtnClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m-8-8h16"
                />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 dark:bg-white shadow-2xl `}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="shadow-sm flex items-center justify-between w-full py-4 p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ms-3">{item.name}</span>
                      </div>
                      {openDropdown === index ? (
                        <FaChevronUp className="text-black" />
                      ) : (
                        <FaChevronDown className="text-black" />
                      )}
                    </button>
                    {openDropdown === index && (
                      <ul className="pl-6 mt-1 space-y-1">
                        {item.dropdown.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={subItem.link}
                              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 cursor-pointer"
                            >
                              <span className="ms-3">{subItem.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={item.link}
                    className="shadow-sm py-4 flex items-center p-2 text-gray-900 rounded-lg dark:text-black hover:bg-gray-100 cursor-pointer"
                  >
                    {item.icon}
                    <span className="ms-3">{item.name}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Navbar;
