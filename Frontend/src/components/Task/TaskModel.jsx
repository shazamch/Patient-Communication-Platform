import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import userMiddleware from "../../redux/middleware/userMiddleware";
import taskMiddleware from "../../redux/middleware/taskMiddleware";
import { useSocket } from "../../context/SocketProvider";

const TaskModal = ({ isOpen, onClose, referenceMessage }) => {

  const socket = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [taskData, setTaskData] = useState({
    taskDescription: "",
    assignedToID: currentUser._id || "",
    assignedToName: currentUser.name || "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
    searchQuery: "",
    filteredUsers: [],
    dropdownVisible: false,
  });

  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await dispatch(userMiddleware.GetAllUsers());
        if (response.success) {
          setAllUsers(response.data);
        } else {
          console.error("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, [dispatch]);

  useEffect(() => {
    const results = allUsers.filter((user) =>
      user.name.toLowerCase().includes(taskData.searchQuery.toLowerCase())
    );
    setTaskData((prevData) => ({
      ...prevData,
      filteredUsers: results,
    }));
  }, [taskData.searchQuery, allUsers]);

  const handleUserSelect = (userId, userName) => {
    setTaskData((prevData) => ({
      ...prevData,
      assignedToID: userId,
      assignedToName: userName,
      searchQuery: userName,
      dropdownVisible: false,
    }));
  };

  const handleInputFocus = () => {
    setTaskData((prevData) => ({
      ...prevData,
      dropdownVisible: true,
    }));
  };

  const handleSubmit = async () => {
    const taskDataToSubmit = {
      messageId: referenceMessage?.id || null,
      message: referenceMessage?.message || null,
      taskDescription: taskData.taskDescription,
      assignedToID: taskData.assignedToID,
      assignedToName: taskData.assignedToName,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      createdByID: currentUser._id,
      createdByName: currentUser.name,
    };

    try {
      const response = await dispatch(taskMiddleware.createTask(taskDataToSubmit));
      if (response.success) {
        setAllUsers(response.data);
        taskDataToSubmit._id = new Date().getTime(); // Temporary ID
        socket.emit('taskData', taskDataToSubmit);
      } else {
        console.error("Failed to submit task.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-3xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Task</h2>
        {referenceMessage && (
          <p className="text-gray-600 mb-4">
            <strong className="text-gray-800">Reference Message:</strong> {referenceMessage.message}
          </p>
        )}
        <form>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Task Description</label>
            <textarea
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              rows="4"
              value={taskData.taskDescription}
              onChange={(e) => setTaskData({ ...taskData, taskDescription: e.target.value })}
              placeholder="Enter task description"
            ></textarea>
          </div>

          {/* Assigned To and Search input in a single row */}
          <div className=" mb-6 relative">
              <label className="block text-sm font-medium text-gray-700">Search User</label>
              <input
                type="text"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={taskData.searchQuery}
                onChange={(e) => setTaskData({ ...taskData, searchQuery: e.target.value })}
                placeholder="Search user by name"
                onFocus={handleInputFocus}
                onBlur={() => setTimeout(() => setTaskData({ ...taskData, dropdownVisible: false }), 200)} // Allow time for selection
              />
              {taskData.dropdownVisible && taskData.filteredUsers.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-32 overflow-y-auto z-10 shadow-lg">
                  {taskData.filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="p-3 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                      onMouseDown={() => handleUserSelect(user._id, user.name)} // Use onMouseDown to handle selection
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={taskData.status}
                onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            />
          </div>
        </form>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-myblue text-white rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
