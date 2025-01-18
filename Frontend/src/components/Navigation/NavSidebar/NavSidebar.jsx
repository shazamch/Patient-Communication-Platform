import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLogo from '../../../assets/MainLogo.svg';
import NavSidebarItems from './NavSidebarItems';
import { ExpandableIcon } from '../../../assets/sidebarIcons/SidebarIcons';
import { logout } from "../../../redux/actions/userAction";
import UserProfileModel from '../userProfileModel/UserProfleModel'; // Import the UserProfileModel component

function NavSidebar({ isDarkMode }) {
    const [isSubMenuExpanded, setIsSubMenuExpanded] = useState(false);
    const [isModelOpen, setisModelOpen] = useState(false); // State for controlling the profile modal visibility
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user); // Get user data from Redux

    const toggleCustomersSection = () => {
        setIsSubMenuExpanded(prev => !prev);
    };

    const handleLogout = () => {
        dispatch(logout());
        setisModelOpen(false); // Close modal after logout
    };

    const handleMyProfile = () => {
        setisModelOpen(false); // Close modal and navigate to the profile page
        // You can use the navigate function to go to the profile page
        // navigate('/myprofile');
    };

    return (
        <div className="flex flex-col justify-between bg-myblue gap-2 h-screen transition-all duration-500 ease-in-out max-w-14 flex-shrink-0">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center">
                <img src={MainLogo} alt="YANA Logo" height="10px" className="h-10 invert" />
                <span className="text-xs mt-2 text-center font-bold text-white">Patient Communication Platform</span>
            </div>

            {/* Below menu */}
            <nav className="px-5 flex-grow overflow-y-auto">
                <ul className="flex flex-col gap-2 justify-center mt-4">
                    {NavSidebarItems().map(({ to, icon, label, hasSubmenu, subItems }) => (
                        <li key={to} className="flex flex-col gap-1.5 items-center">
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    `flex flex-col items-center font-medium px-2 py-1 rounded-lg relative gap-1.5 w-[90px] hover:bg-gray-200 ${isActive
                                        ? `text-gray-800 bg-gray-100`
                                        : `text-white`
                                    }`
                                }
                                onClick={hasSubmenu ? toggleCustomersSection : undefined}
                            >
                                {/* Icon and Label */}
                                <div className="group flex flex-col items-center relative">
                                    <span className="flex items-center justify-center text-xl">
                                        {React.cloneElement(icon, { isActive: to === window.location.pathname })}
                                    </span>

                                    {/* Label shown only when expanded */}
                                    <span className="text-xs text-center mt-1">{label}</span>
                                </div>

                                {/* Submenu indicator */}
                                {hasSubmenu && <ExpandableIcon isExpanded={isSubMenuExpanded} />}
                            </NavLink>

                            {/* Render Submenus Dynamically */}
                            {/* {hasSubmenu && isSubMenuExpanded && (
                                <ul className="flex flex-col gap-1.5 ml-10 list-none p-0 m-0">
                                    {subItems?.map(({ to: subTo, label: subLabel }) => (
                                        <li key={subTo}>
                                            <NavLink
                                                to={subTo}
                                                className={({ isActive }) =>
                                                    `hover:bg-[#ffe6e9] flex items-center font-medium p-1.5 text-sm transition-colors rounded ${isActive ? 'text-red-600 bg-[#ffe6e9]' : 'text-gray-800 hover:text-red-600'
                                                    }`
                                                }
                                            >
                                                {subLabel}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )} */}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setisModelOpen(true)}>
                    <UserProfileModel
                        isModelOpen={isModelOpen}
                        toggleModel={setisModelOpen}
                        onLogout={handleLogout}
                        onProfile={handleMyProfile}
                    />
                </div>
        </div>
    );
}

export default NavSidebar;
