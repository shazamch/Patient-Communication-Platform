import React from 'react';
import NavSidebar from '../NavSidebar/NavSidebar';
import Header from '../Header/Header';

function Layout({ children }) {
  return (
    <div className="flex bg-gray-100">
      <NavSidebar />
      <div className="flex flex-col flex-grow p-2 gap-5 overflow-auto bg-myblue">
        {/* <Header/> */}
        <div className="flex-grow h-[calc(100vh-100px)] w-[calc(100vw-80px)] bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
} 

export default Layout;