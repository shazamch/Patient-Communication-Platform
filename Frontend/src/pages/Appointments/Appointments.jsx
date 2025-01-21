import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../../context/SocketProvider";
import appointmentMiddleware from "../../redux/middleware/appointmentMiddleware";
import Table from "../../elements/table/Table";
import statusStyles from "../../util/statusStyles/StatusStyles";
import CustomDropdown from "../../elements/customDropdown/CustomDropdown"
import EyeIcon from '../../assets/genearlIcons/EyeIcon.svg';
import ButtonWithIcon from '../../elements/buttonWithIcon/ButtonWithIcon';
import AppointmentModel from "../../components/Appointments/AppointmentModel";

function Appointments({tableHeight}) {
  const dispatch = useDispatch();
  const socket = useSocket();

  const [allAppointments, setAllAppointmants] = useState([]);
  const [notification, setNotification] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const [isModalOpen, setisModalOpen] = useState(false);
    const [isDataUpdated, setisDataUpdated] = useState(false);

    const [formData, setformData] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 100;
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    const displayedData = filteredData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const response = await dispatch(
          appointmentMiddleware.getAllAppointmentsByDoctorID(currentUser._id)
        );
        if (response.success) {
          setAllAppointmants(response.data);
          setFilteredData(response.data);
          setisLoading(false);
        } else {
          console.error("Failed to fetch appointments.");
          setisLoading(false); // Ensure isLoading is false even if data fetch fails
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setisLoading(false); // Ensure isLoading is false even if there is an error
      }
    };
    

    fetchAllAppointments();
  }, [dispatch]);

  // Listen for real-time appointment updates via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("appointmentData", (appointmentData) => {
      if (currentUser._id === appointmentData.doctorID) {
        setNotification("You have been assigned a new appointment!");
        setTimeout(() => setNotification(""), 4000);

        setAllAppointmants((prevAppointments) => {
          const updatedAppointments = [...prevAppointments, appointmentData];
          setFilteredData(updatedAppointments);
          return updatedAppointments;
        });
      }
    });

    return () => {
      socket.off("appointmentData");
    };
  }, [socket, currentUser]);

  const Columns = [
    { key: 'doctorName', header: 'Doctor' },
    { key: 'patientName', header: 'Patient' },
    {
      key: 'appointmentDate',
      header: 'Date',
      transform: (row) => {
        const appointmentDate = row.appointmentDate;
    
        if (appointmentDate) {
          const date = new Date(appointmentDate);
          const formattedDate = date.toLocaleDateString('en-US');
          return formattedDate;
        }
        return 'N/A';
      }
    },    
    { key: 'appointmentTime', header: 'Time' },
    { key: 'status', header: 'Status' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Sort by: Newest' },
    { value: 'oldest', label: 'Sort by: Oldest' },
  ];

  const handleScheduleAppointmentClick = () => setisModalOpen(true);
  const closeModal = () => setisModalOpen(false);
  
  if (!tableHeight) {
    tableHeight = "h-[calc(100vh-250px)]"
  }

  return (
    <div className="flex flex-col p-4">
      {/* Notification Area */}
      {notification && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md shadow-md">
          {notification}
        </div>
      )}
      <div className="flex gap-3 justify-end items-center mb-4">
      <ButtonWithIcon
            onClick={handleScheduleAppointmentClick}
            // icon={<img src={PlaceOrderIcon} alt="import file" width={18} height={18} />}
            text="Schedule"
            className="bg-myblue text-white px-3 py-2 rounded-full"
          />
          </div>
          <Table
          tableTitle="Appointmenst"
          tableSubTitle="Your upcoming appointments"
          columns={Columns}
          rows={displayedData}
          // secondlastColumnName="Status"
          // lastColumnName="Details"
          searchBarData={allAppointments}
          searchBarSetData={setFilteredData}
          searchBarKey="Name"
          searchBarclassName="h-8 bg-gray-100 border border-gray-100 rounded-md px-2"
          sortDropdownData={allAppointments}
          sortDropdownSetData={setFilteredData}
          sortDropdownOptions={sortOptions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData?.length}
          tableHeight={tableHeight}
          isLoading={isLoading}
        >
          {(appointment) => (
            <tr key={appointment._id}> {/* Ensure each row has a unique key */}
              <td className="py-6 px-4 flex items-center">
                {/* <CustomDropdown
                  id="status"
                  name="status"
                  className={statusStyles[appointment.Status]}
                  value={appointment.status}
                  onChange={(e) => handleInputChange(e, appointment)}
                  placeholder="Select Status"
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "In Progress", label: "In Progress" },
                  ]}
                /> */}
              </td>
              {/* <td className="py-3 px-5">
                <button onClick={() => handleDetailsClick(appointment)}>
                  <img src={EyeIcon} alt="View" width={18} height={18} />
                </button>
              </td> */}
            </tr>
          )}
        </Table>
        {isModalOpen && (
            <AppointmentModel isOpen={isModalOpen} onClose={closeModal} />
          )}
      </div>
  );
}

export default Appointments;