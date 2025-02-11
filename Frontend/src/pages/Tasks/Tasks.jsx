import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../../context/SocketProvider";
import taskMiddleware from "../../redux/middleware/taskMiddleware";
import Table from "../../elements/table/Table";
import statusStyles from "../../util/statusStyles/StatusStyles";
import CustomDropdown from "../../elements/customDropdown/CustomDropdown"
import EyeIcon from '../../assets/genearlIcons/EyeIcon.svg';
import ButtonWithIcon from '../../elements/buttonWithIcon/ButtonWithIcon';
import TaskModal from "../../components/Task/TaskModel";

function Tasks({tableHeight}) {
  const dispatch = useDispatch();
  const socket = useSocket();

  const [allTasks, setAllTasks] = useState([]);
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

    const handleCreateTaskClick = () => setisModalOpen(true);
    const closeModal = () => setisModalOpen(false);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await dispatch(
          taskMiddleware.getAllTasksByAssiginToID(currentUser._id)
        );
        if (response.success) {
          setAllTasks(response.data);
          setFilteredData(response.data);
          setisLoading(false); // Set isLoading to false after fetching data
        } else {
          console.error("Failed to fetch tasks.");
          setisLoading(false); // Ensure isLoading is false even if data fetch fails
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setisLoading(false); // Ensure isLoading is false even if there is an error
      }
    };
    

    fetchAllTasks();
  }, [dispatch]);

  // Listen for real-time task updates via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("taskData", (taskData) => {
      if (currentUser._id === taskData.assignedToID) {
        setNotification("A new task has been assigned to you!");
        setTimeout(() => setNotification(""), 4000);
        setAllTasks((prevTasks) => [...prevTasks, taskData]);
      }
    });

    return () => {
      socket.off("taskData");
    };
  }, [socket, currentUser]);

  const TaskColumns = [
    { key: 'taskDescription', header: 'Description' },
    { key: 'priority', header: 'Priority' },
    {
      key: 'dueDate',
      header: 'Due Date',
      transform: (row) => {
        // Assuming the dueDate is a string or a Date object
        const dueDate = row.dueDate;
    
        if (dueDate) {
          const date = new Date(dueDate);
          // Format the date as needed, here it's formatted as 'MM/DD/YYYY'
          const formattedDate = date.toLocaleDateString('en-US');
          return formattedDate;
        }
        return 'N/A';
      }
    },    
    { key: 'createdByName', header: 'Created By' },
    { key: 'status', header: 'Status' },
  ];

  const AppointmentColumns = [
    { key: 'taskDescription', header: 'Description' },
    { key: 'priority', header: 'Priority' },
    {
      key: 'dueDate',
      header: 'Due Date',
      transform: (row) => {
        // Assuming the dueDate is a string or a Date object
        const dueDate = row.dueDate;
    
        if (dueDate) {
          const date = new Date(dueDate);
          // Format the date as needed, here it's formatted as 'MM/DD/YYYY'
          const formattedDate = date.toLocaleDateString('en-US');
          return formattedDate;
        }
        return 'N/A';
      }
    },    
    { key: 'createdByName', header: 'Created By' },
    { key: 'status', header: 'Status' },
  ];

  const title = "Tasks";
  const subtitle = "Assigened to you";

  const sortOptions = [
    { value: 'newest', label: 'Sort by: Newest' },
    { value: 'oldest', label: 'Sort by: Oldest' },
  ];

  if (!tableHeight) {
    tableHeight = "h-[calc(100vh-250px)]"
  }

  return (
    <div className="p-4">
      {/* Notification Area */}
      {notification && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md shadow-md">
          {notification}
        </div>
      )}
      <div className="flex gap-3 justify-end items-center mb-4">
      <ButtonWithIcon
            onClick={handleCreateTaskClick}
            // icon={<img src={PlaceOrderIcon} alt="import file" width={18} height={18} />}
            text="Create Task"
            className="bg-myblue text-white px-3 py-2 rounded-full"
          />
          </div>
            <Table
              tableTitle="Tasks"
              tableSubTitle="Assigened to you"
              columns={TaskColumns}
              rows={displayedData}
              // secondlastColumnName="Status"
              // lastColumnName="Details"
              searchBarData={allTasks}
              searchBarSetData={setFilteredData}
              searchBarKey="Name"
              searchBarclassName="h-8 bg-gray-100 border border-gray-100 rounded-md px-2"
              sortDropdownData={allTasks}
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
              {(task) => (
                <tr key={task._id}> {/* Ensure each row has a unique key */}
                  <td className="py-6 px-4 flex items-center">
                    {/* <CustomDropdown
                      id="status"
                      name="status"
                      className={statusStyles[task.Status]}
                      value={task.status}
                      onChange={(e) => handleInputChange(e, task)}
                      placeholder="Select Status"
                      options={[
                        { value: "Pending", label: "Pending" },
                        { value: "In Progress", label: "In Progress" },
                      ]}
                    /> */}
                  </td>
                  {/* <td className="py-3 px-5">
                    <button onClick={() => handleDetailsClick(task)}>
                      <img src={EyeIcon} alt="View" width={18} height={18} />
                    </button>
                  </td> */}
                </tr>
              )}
          </Table>
          {isModalOpen && (
            <TaskModal isOpen={isModalOpen} onClose={closeModal} />
          )}
      </div>
  );
}

export default Tasks;