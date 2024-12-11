import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNav } from "../navigation/index";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Reducers/authReducer";
import logo from "../assets/logo.png";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [allNav, setAllNav] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const navs = getNav(role);
    setAllNav(navs);
  }, [role]);

  const handleLogout = async () => {
    await dispatch(logout({ navigate, role }));
    setShowSidebar(false);
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`fixed duration-200 ${
          !showSidebar ? "invisible" : "visible"
        } w-screen h-screen bg-[#0000004d] top-0 left-0 z-10`}
      />

      <div
        className={`w-[260px] fixed bg-white z-50 top-0 h-screen shadow-lg transition-all ${
          showSidebar ? "left-0" : "-left-[260px] lg:left-0"
        }`}
      >
        <div className="h-[80px] flex justify-center items-center border-b border-gray-100">
          <Link to="/" className="w-[100px]">
            <img className="w-full h-auto" src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          <div className="px-4 py-3">
            <ul className="flex flex-col gap-1">
              {allNav.map((n, i) => (
                <li key={i}>
                  {n.subMenu ? (
                    <div>
                      <div 
                        onClick={() => toggleSubmenu(n.id)}
                        className="text-gray-700 font-medium px-3 py-2 flex items-center gap-3 rounded-md cursor-pointer hover:bg-blue-50"
                      >
                        <span className="text-lg text-blue-600">{n.icon}</span>
                        <span>{n.title}</span>
                      </div>
                      <ul className={`ml-8 transition-all duration-200 ${expandedMenus[n.id] ? 'max-h-[500px]' : 'max-h-0 overflow-hidden'}`}>
                        {n.subMenu.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              to={sub.path}
                              className={`${
                                pathname === sub.path
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-600 hover:bg-blue-50"
                              } px-3 py-2 rounded-md flex items-center gap-3 text-sm transition-all w-full mb-1`}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      to={n.path}
                      className={`${
                        pathname === n.path
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-blue-50"
                      } px-3 py-2 rounded-md flex items-center gap-3 transition-all w-full mb-1`}
                    >
                      <span className="text-lg">{n.icon}</span>
                      <span>{n.title}</span>
                    </Link>
                  )}
                </li>
              ))}

              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-gray-700 hover:bg-red-50 hover:text-red-500 px-3 py-2 rounded-md flex items-center gap-3 transition-all"
                >
                  <span className="text-lg"><BiLogOutCircle /></span>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
