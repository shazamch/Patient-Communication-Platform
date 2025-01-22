import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import userMiddleware from "../../redux/middleware/userMiddleware";
import appointmentMiddleware from "../../redux/middleware/appointmentMiddleware";
import { useSocket } from "../../context/SocketProvider";

const AppointmentModal = ({ isOpen, onClose }) => {

  const socket = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [appointmentData, setAppointmentData] = useState({
    title: "",
    description: "",
    doctorID: "",
    doctorName: "",
    patientID: "",
    patientName: "",
    appointmentDate: "",
    appointmentTime: "",
    status: "Scheduled",
    searchDoctorQuery: "",
    searchPatientQuery: "",
    filteredDoctors: [],
    filteredPatients: [],
    dropdownVisibleDoctor: false,
    dropdownVisiblePatient: false,
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
    const doctorResults = allUsers.filter((user) =>
      user.name.toLowerCase().includes(appointmentData.searchDoctorQuery.toLowerCase())
    );
    setAppointmentData((prevData) => ({
      ...prevData,
      filteredDoctors: doctorResults,
    }));

    const patientResults = allUsers.filter((user) =>
      user.name.toLowerCase().includes(appointmentData.searchPatientQuery.toLowerCase())
    );
    setAppointmentData((prevData) => ({
      ...prevData,
      filteredPatients: patientResults,
    }));
  }, [appointmentData.searchDoctorQuery, appointmentData.searchPatientQuery, allUsers]);

  const handleUserSelect = (userId, userName, type) => {
    if (type === "doctor") {
      setAppointmentData((prevData) => ({
        ...prevData,
        doctorID: userId,
        doctorName: userName,
        searchDoctorQuery: userName,
        dropdownVisibleDoctor: false,
      }));
    } else if (type === "patient") {
      setAppointmentData((prevData) => ({
        ...prevData,
        patientID: userId,
        patientName: userName,
        searchPatientQuery: userName,
        dropdownVisiblePatient: false,
      }));
    }
  };

  const handleInputFocus = (type) => {
    if (type === "doctor") {
      setAppointmentData((prevData) => ({
        ...prevData,
        dropdownVisibleDoctor: true,
      }));
    } else if (type === "patient") {
      setAppointmentData((prevData) => ({
        ...prevData,
        dropdownVisiblePatient: true,
      }));
    }
  };

  const handleSubmit = async () => {
    const appointmentDataToSubmit = {
      doctorID: appointmentData.doctorID,
      doctorName: appointmentData.doctorName,
      patientID: appointmentData.patientID,
      patientName: appointmentData.patientName,
      description: appointmentData.description,
      title: appointmentData.title,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      status: appointmentData.status,
      createdByID: currentUser._id,
      createdByName: currentUser.name,
    };
    console.log(appointmentDataToSubmit);
    try {
      const response = await dispatch(appointmentMiddleware.createAppointment(appointmentDataToSubmit));
      if (response.success) {
        appointmentDataToSubmit._id = new Date().getTime();
        appointmentDataToSubmit.updatedAt = new Date().getTime();
        socket.emit('appointmentData', appointmentDataToSubmit);
      } else {
        console.error("Failed to submit appointment.");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-3xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Appointment</h2>

        <form>
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              rows="4"
              value={appointmentData.title}
              onChange={(e) => setAppointmentData({ ...appointmentData, title: e.target.value })}
              placeholder="Enter appointment title"
            ></input>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              rows="4"
              value={appointmentData.description}
              onChange={(e) => setAppointmentData({ ...appointmentData, description: e.target.value })}
              placeholder="Enter appointment description"
            ></textarea>
          </div>

          {/* Search Doctor */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">Search Doctor</label>
            <input
              type="text"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={appointmentData.searchDoctorQuery}
              onChange={(e) => setAppointmentData({ ...appointmentData, searchDoctorQuery: e.target.value })}
              placeholder="Search doctor by name"
              onFocus={() => handleInputFocus("doctor")}
              onBlur={() => setTimeout(() => setAppointmentData({ ...appointmentData, dropdownVisibleDoctor: false }), 200)} // Allow time for selection
            />
            {appointmentData.dropdownVisibleDoctor && appointmentData.filteredDoctors.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-32 overflow-y-auto z-10 shadow-lg">
                {appointmentData.filteredDoctors.map((user) => (
                  <li
                    key={user._id}
                    className="p-3 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    onMouseDown={() => handleUserSelect(user._id, user.name, "doctor")}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search Patient */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">Search Patient</label>
            <input
              type="text"
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={appointmentData.searchPatientQuery}
              onChange={(e) => setAppointmentData({ ...appointmentData, searchPatientQuery: e.target.value })}
              placeholder="Search patient by name"
              onFocus={() => handleInputFocus("patient")}
              onBlur={() => setTimeout(() => setAppointmentData({ ...appointmentData, dropdownVisiblePatient: false }), 200)} // Allow time for selection
            />
            {appointmentData.dropdownVisiblePatient && appointmentData.filteredPatients.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-32 overflow-y-auto z-10 shadow-lg">
                {appointmentData.filteredPatients.map((user) => (
                  <li
                    key={user._id}
                    className="p-3 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    onMouseDown={() => handleUserSelect(user._id, user.name, "patient")}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Appointment Date and Time */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
              <input
                type="date"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={appointmentData.appointmentDate}
                onChange={(e) => setAppointmentData({ ...appointmentData, appointmentDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
              <input
                type="time"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={appointmentData.appointmentTime}
                onChange={(e) => setAppointmentData({ ...appointmentData, appointmentTime: e.target.value })}
              />
            </div>
          </div>

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
              className="py-2 px-6 bg-myblue text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              onClick={handleSubmit}
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
