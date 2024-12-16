// ProfileDetails.js
import React from 'react';

const ProfileDetails = ({ userData, onClose, isDarkMode }) => {
    return (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-50'} flex items-center justify-center z-50`}>
            <div className={`rounded-lg p-4 w-3/4 max-w-md relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <button onClick={onClose} className={`absolute top-2 right-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    &times;
                </button>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <img 
                    src={userData.profilePhoto} 
                    alt={`${userData.name}'s profile`} 
                    className="h-24 w-24 rounded-full mt-2" 
                />
                <p className="mt-2">Email: {userData.email}</p>
                <p className="mt-2">Phone: {userData.phone}</p>
                <p className="mt-2">Bio: {userData.bio}</p>
                {/* Add more user details as needed */}
            </div>
        </div>
    );
};

export default ProfileDetails;
