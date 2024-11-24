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
        } w-screen h-screen bg-[#8cbce780] top-0 left-0 z-10`}
      />

      <div
        className={`w-[260px] fixed bg-[#e6e7fb] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${
          showSidebar ? "left-0" : "-left-[260px] lg:left-0"
        }`}
      >
        <div className="h-[100px] flex justify-center items-center border-b border-[#e6e7fb]">
          <Link to="/" className="w-auto h-[80px]">
            <img className="w-full h-full" src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
          <div className="px-[16px] py-[10px]">
            <ul>
              {allNav.map((n, i) => (
                <li key={i}>
                  {n.subMenu ? (
                    <div>
                      <div 
                        onClick={() => toggleSubmenu(n.id)}
                        className="text-[#030811] font-bold px-[12px] py-[9px] flex items-center gap-[12px] cursor-pointer hover:bg-blue-100 rounded-sm"
                      >
                        <span>{n.icon}</span>
                        <span>{n.title}</span>
                      </div>
                      <ul className={`pl-8 transition-all duration-200 ${expandedMenus[n.id] ? 'max-h-[500px]' : 'max-h-0 overflow-hidden'}`}>
                        {n.subMenu.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              to={sub.path}
                              className={`${
                                pathname === sub.path
                                  ? "bg-blue-600 shadow-indigo-500/50 text-white"
                                  : "text-[#030811]"
                              } px-[12px] py-[9px] rounded-sm flex items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
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
                          ? "bg-blue-600 shadow-indigo-500/50 text-white"
                          : "text-[#030811]"
                      } px-[12px] py-[9px] rounded-sm flex items-center gap-[12px] hover:pl-4 transition-all w-full mb-1`}
                    >
                      <span>{n.icon}</span>
                      <span>{n.title}</span>
                    </Link>
                  )}
                </li>
              ))}

              <li>
                <button
                  onClick={handleLogout}
                  className="text-[#030811] font-bold duration-200 px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1"
                >
                  <span><BiLogOutCircle /></span>
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
