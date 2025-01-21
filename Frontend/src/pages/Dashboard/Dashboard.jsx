import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSocket } from "../../context/SocketProvider";
import taskMiddleware from "../../redux/middleware/taskMiddleware";
import Table from "../../elements/table/Table";
import statusStyles from "../../util/statusStyles/StatusStyles";
import CustomDropdown from "../../elements/customDropdown/CustomDropdown"
import EyeIcon from '../../assets/genearlIcons/EyeIcon.svg';

import Tasks from "../Tasks/Tasks"
import Appointments from "../Appointments/Appointments";

function Dashboard() {
  return(
    <div>
    <Tasks tableHeight="h-[calc(100vh-580px)]"/>
    <Appointments tableHeight="h-[calc(100vh-580px)]"/>
    </div>
  );
}

export default Dashboard;