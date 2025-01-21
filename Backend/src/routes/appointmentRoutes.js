const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentsController');

// Route to create a new appointment
router.post('/', appointmentController.createAppointment);

// Route to fetch all appointments
router.get('/', appointmentController.getAllAppointments);

// Route to fetch a specific appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Route to fetch appointments assigned to a specific user
router.get('/assigned/:userID', appointmentController.getAppointmentsByAssignedToID);

// Route to fetch appointments by doctor ID
router.get('/doctor/:doctorID', appointmentController.getAppointmentsByDoctorID);

// Route to fetch appointments by patient ID
router.get('/patient/:patientID', appointmentController.getAppointmentsByPatientID);


// Route to update a specific appointment by ID
router.put('/:id', appointmentController.updateAppointment);

// Route to delete a specific appointment by ID
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
