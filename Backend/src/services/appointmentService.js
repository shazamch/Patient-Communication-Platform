const AppointmentModel = require("../models/appointmentsModel");

// Create a new Appointment
exports.createAppointment = async (appointmentData) => {
  try {
    const newAppointment = new AppointmentModel(appointmentData);
    await newAppointment.save();
    return { success: true, appointment: newAppointment };
  } catch (error) {
    console.error("Error in createAppointment service:", error);
    return {
      success: false,
      message: "An error occurred while creating the appointment.",
    };
  }
};

// Get all Appointments
exports.getAllAppointments = async () => {
  try {
    const appointments = await AppointmentModel.find();
    return { success: true, appointments };
  } catch (error) {
    console.error("Error in getAllAppointments service:", error);
    return {
      success: false,
      message: "An error occurred while fetching appointments.",
    };
  }
};

// Get a single Appointment by ID
exports.getAppointmentById = async (appointmentId) => {
  try {
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return { success: false, message: "Appointment not found." };
    }
    return { success: true, appointment };
  } catch (error) {
    console.error("Error in getAppointmentById service:", error);
    return {
      success: false,
      message: "An error occurred while fetching the appointment.",
    };
  }
};

// Update an Appointment
exports.updateAppointment = async (appointmentId, updateData) => {
  try {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAppointment) {
      return { success: false, message: "Appointment not found." };
    }
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error("Error in updateAppointment service:", error);
    return {
      success: false,
      message: "An error occurred while updating the appointment.",
    };
  }
};

// Delete an Appointment
exports.deleteAppointment = async (appointmentId) => {
  try {
    const deletedAppointment = await AppointmentModel.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return { success: false, message: "Appointment not found." };
    }
    return { success: true, message: "Appointment deleted successfully." };
  } catch (error) {
    console.error("Error in deleteAppointment service:", error);
    return {
      success: false,
      message: "An error occurred while deleting the appointment.",
    };
  }
};

// Get Appointments by Doctor ID
exports.getAppointmentsByDoctorID = async (doctorID) => {
  try {
    const appointments = await AppointmentModel.find({ doctorID });

    if (!appointments || appointments.length === 0) {
      return { success: false, message: "No appointments found for this doctor." };
    }
    return { success: true, appointments };
  } catch (error) {
    console.error("Error in getAppointmentsByDoctorID service:", error);
    return {
      success: false,
      message: "An error occurred while fetching appointments.",
    };
  }
};

// Get Appointments by Patient ID
exports.getAppointmentsByPatientID = async (patientID) => {
  try {
    const appointments = await AppointmentModel.find({ patientID });

    if (!appointments || appointments.length === 0) {
      return { success: false, message: "No appointments found for this patient." };
    }
    return { success: true, appointments };
  } catch (error) {
    console.error("Error in getAppointmentsByPatientID service:", error);
    return {
      success: false,
      message: "An error occurred while fetching appointments.",
    };
  }
};
