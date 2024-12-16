import React from 'react';
import NavSidebar from '../NavSidebar/NavSidebar';
import Header from '../Header/Header';

function Layout({ children }) {
  return (
    <div className="flex bg-gray-100">
      <NavSidebar />
      <div className="flex flex-col flex-grow p-4 gap-5 overflow-auto">
        <Header />
        <div className="flex-grow h-[calc(100vh-125px)] w-[calc(100vw-130px)] bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
} 

export default Layout;