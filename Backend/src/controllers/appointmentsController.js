const appointmentService = require("../services/appointmentService");

// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const appointmentData = req.body;
    const response = await appointmentService.createAppointment(appointmentData);

    if (!response.success) {
      return res.sendResponse(400, false, response.message);
    }

    res.sendResponse(
      201,
      true,
      "Appointment created successfully",
      response.appointment,
      accessToken
    );
  } catch (error) {
    console.error("Error in createAppointment controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get All Appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { accessToken } = req.user;

    const response = await appointmentService.getAllAppointments();

    if (!response.success) {
      return res.sendResponse(400, false, response.message);
    }

    res.sendResponse(
      200,
      true,
      "Appointments fetched successfully",
      response.appointments,
      accessToken
    );
  } catch (error) {
    console.error("Error in getAllAppointments controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const appointmentId = req.params.id;

    const response = await appointmentService.getAppointmentById(appointmentId);

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(
      200,
      true,
      "Appointment fetched successfully",
      response.appointment,
      accessToken
    );
  } catch (error) {
    console.error("Error in getAppointmentById controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const appointmentId = req.params.id;
    const updateData = req.body;

    const response = await appointmentService.updateAppointment(
      appointmentId,
      updateData
    );

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(
      200,
      true,
      "Appointment updated successfully",
      response.appointment,
      accessToken
    );
  } catch (error) {
    console.error("Error in updateAppointment controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Delete Appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const appointmentId = req.params.id;

    const response = await appointmentService.deleteAppointment(appointmentId);

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(200, true, response.message, null, accessToken);
  } catch (error) {
    console.error("Error in deleteAppointment controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get Appointments by Assigned User ID
exports.getAppointmentsByAssignedToID = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const userID = req.params.userID;

    const response = await appointmentService.getAppointmentsByAssignedToID(
      userID
    );

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(
      200,
      true,
      "Appointments fetched successfully",
      response.appointments,
      accessToken
    );
  } catch (error) {
    console.error("Error in getAppointmentsByAssignedToID controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

exports.getAppointmentsByDoctorID = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const doctorID = req.params.doctorID;

    const response = await appointmentService.getAppointmentsByDoctorID(doctorID);

    if (!response.success) {
      return res.sendResponse(200, true, response.message, []);
    }

    res.sendResponse(
      200,
      true,
      "Appointments fetched successfully",
      response.appointments,
      accessToken
    );
  } catch (error) {
    console.error("Error in getAppointmentsByDoctorID controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get Appointments by Patient ID
exports.getAppointmentsByPatientID = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const patientID = req.params.patientID;

    const response = await appointmentService.getAppointmentsByPatientID(patientID);

    if (!response.success) {
      return res.sendResponse(200, true, response.message, []);
    }

    res.sendResponse(
      200,
      true,
      "Appointments fetched successfully",
      response.appointments,
      accessToken
    );
  } catch (error) {
    console.error("Error in getAppointmentsByPatientID controller:", error);
    res.sendResponse(500, false, error.message);
  }
};