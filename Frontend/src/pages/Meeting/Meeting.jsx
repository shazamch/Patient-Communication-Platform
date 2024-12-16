import React, { useState } from 'react';
import JoinMeetingModal from '../../components/Meeting/JoinMeetingModel/JoinMeetingModel';
import JoinMeeting from "../../assets/customIcons/meetingIcons/joinmeeting.svg";
import CreateMeeting from "../../assets/customIcons/meetingIcons/createmeeting.svg";
import ScheduleMeeting from "../../assets/customIcons/meetingIcons/schedulemeeting.svg";
import MoreOptions from "../../assets/customIcons/meetingIcons/moreoptions.svg";

function Meetings() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleClick = (action) => {
    switch (action) {
      case 'create':
        alert('Create Meeting functionality to be implemented.');
        break;
      case 'join':
        setIsJoinModalOpen(true);
        break;
      case 'schedule':
        alert('Schedule Meeting functionality to be implemented.');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-115px)] w-[calc(100vw-130px)] bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-8">
        {/* Create Meeting Icon */}
        <div
          className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-lg text-black cursor-pointer hover:bg-gray-200"
          onClick={() => handleClick('create')}
        >
          <img src={CreateMeeting} alt="Create Meeting" className="w-16 h-16" />
          <span className="mt-2 text-lg">Create Meeting</span>
        </div>

        {/* Join Meeting Icon */}
        <div
          className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-lg text-black cursor-pointer hover:bg-gray-200"
          onClick={() => handleClick('join')}
        >
          <img src={JoinMeeting} alt="Join Meeting" className="w-16 h-16" />
          <span className="mt-2 text-lg">Join Meeting</span>
        </div>

        {/* Schedule Meeting Icon */}
        <div
          className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-lg text-black cursor-pointer hover:bg-gray-200"
          onClick={() => handleClick('schedule')}
        >
          <img src={ScheduleMeeting} alt="Schedule Meeting" className="w-16 h-16" />
          <span className="mt-2 text-lg">Schedule Meeting</span>
        </div>

        {/* Placeholder for additional functionality */}
        <div
          className="flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-lg text-black cursor-pointer hover:bg-gray-200"
          onClick={() => alert('Additional feature to be implemented.')}
        >
          <img src={MoreOptions} alt="More Options" className="w-16 h-16" />
          <span className="mt-2 text-lg">More Options</span>
        </div>
      </div>

      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}

export default Meetings;
