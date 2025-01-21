import React, { useState } from 'react';
import CrossButton from "../../../elements/crossButton/CrossButton";
import CreateMeeting from "../../../assets/customIcons/meetingIcons/createmeeting.svg";
import JoinMeeting from "../../../assets/customIcons/meetingIcons/joinmeeting.svg";
import ScheduleMeeting from "../../../assets/customIcons/meetingIcons/schedulemeeting.svg";
import MoreOptions from "../../../assets/customIcons/meetingIcons/moreoptions.svg";
import JoinMeetingModal from '../JoinMeetingModel/JoinMeetingModel';

function MeetingSidebar({ onSelectChat, isDarkMode}) {

    const handleButtonClick = (action) => {
        switch (action) {
            case 'create':
                alert('Create Meeting functionality to be implemented.');
                break;
            case 'join':
                onSelectChat()
                break;
            case 'schedule':
                alert('Schedule Meeting functionality to be implemented.');
                break;
            case 'more':
                alert('Schedule Meeting functionality to be implemented.');
                break;
            default:
                break;
        }
    };

    return (
        <div className={`py-8 px-3 flex flex-col w-80 h-[calc(100vh-30px)] border-r border-gray-150 rounded-3xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>

            {/* Title: Recent Chats or Start New Chat */}
            <div className="flex justify-between items-center mt-4 ">
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Meetings
                </h2>
            </div>

            {/* Buttons Section */}
            <div className="mt-4 flex flex-col gap-4">
                {/* Create Meeting Button */}
                <div
                    className="flex items-center gap-4 p-3 rounded-lg text-black cursor-pointer hover:bg-gray-50 border-b"
                    onClick={() => handleButtonClick('create')}
                >
                    <img src={CreateMeeting} alt="Create Meeting" className="w-8 h-8" />
                    <span className="text-md">Create Meeting</span>
                </div>

                {/* Join Meeting Button */}
                <div
                    className="flex items-center gap-4 p-3 rounded-lg text-black cursor-pointer hover:bg-gray-50 border-b"
                    onClick={() => handleButtonClick('join')}
                >
                    <img src={JoinMeeting} alt="Join Meeting" className="w-8 h-8" />
                    <span className="text-md">Join Meeting</span>
                </div>

                {/* Schedule Meeting Button */}
                <div
                    className="flex items-center gap-4 p-3 rounded-lg text-black cursor-pointer hover:bg-gray-50 border-b"
                    onClick={() => handleButtonClick('schedule')}
                >
                    <img src={ScheduleMeeting} alt="Schedule Meeting" className="w-8 h-8" />
                    <span className="text-md">Schedule Meeting</span>
                </div>

                {/* More Options Button */}
                <div
                    className="flex items-center gap-4 p-3 rounded-lg text-black cursor-pointer hover:bg-gray-50 border-b"
                    onClick={() => handleButtonClick('more')}
                >
                    <img src={MoreOptions} alt="More Options" className="w-8 h-8" />
                    <span className="text-md">More Options</span>
                </div>
            </div>
        </div>
    );
}

export default MeetingSidebar;
