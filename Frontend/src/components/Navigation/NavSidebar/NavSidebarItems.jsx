import React from 'react';
import { DashBoardIcon,  MealsIcon, MenusIcon,CustomersIcon, ChatIcon, PersIcon, ReviewsIcon, UmsIcon, VendorsIcon } from '../../../assets/sidebarIcons/SidebarIcons';
import Dashboard from '../../../pages/Dashboard/Dashboard';

const allSidebarItems = [
  { to: "/dashboard", icon: <DashBoardIcon/>, label: "Dashboard", permission: "Dashboard" },
  { to: "/chat", icon: <ChatIcon/>, label: "Chat", permission: "Chat" },
  { to: "/meetings", icon: <ChatIcon/>, label: "Meetings", permission: "Meetings" },
//   {
//     to: "/customers",
//     icon: <CustomersIcon />,
//     label: "Customers",
//     hasSubmenu: true,
//     permission: "Customers",
//     subItems: [
//       { to: "/customers", label: "All Customers" },
//       { to: "/CustomerChanges", label: "Customer Changes" },
//       { to: "/customersrequests", label: "Customer Requests" },
//     ],
//   },
//   { to: "/meals", icon: <MealsIcon/>, label: "Meals", permission: "Meals" },
//   { to: "/menus", icon: <MenusIcon/>, label: "Menus", permission: "Menus" },
//   { to: "/vendors", icon: <VendorsIcon/>, label: "Vendors", permission: "Vendors" },
//   { to: "/reviews", icon: <ReviewsIcon/>, label: "Reviews", permission: "Reviews" },
//   { to: "/ums", icon: <UmsIcon/>, label: "UMS", permission: "UMS" },
//   { to: "/pers", icon: <PersIcon/>, label: "PERS", permission: "PERS" },
];


// Filter sidebar items based on permissions
const getFilteredSidebarItems = (permissions) => {
  if (permissions.includes("All")) return allSidebarItems;
  return allSidebarItems.filter(item => permissions.includes(item.permission));
};

// SidebarItems Component
const SidebarItems = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userPermissions = user?.Permissions || [];
//   const sidebarItems = getFilteredSidebarItems(userPermissions);
  const sidebarItems = allSidebarItems;
  return sidebarItems
};

export default SidebarItems;
