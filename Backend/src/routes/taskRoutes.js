const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route to create a new task
router.post('/', taskController.createTask);

// Route to fetch all tasks
router.get('/', taskController.getAllTasks);

// Route to fetch a specific task by ID
router.get('/:id', taskController.getTaskById);

// Route to fetch tasks assigned to a specific user
router.get('/assigned/:userID', taskController.getTasksByAssignedToID);

// Route to update a specific task by ID
router.put('/:id', taskController.updateTask);

// Route to delete a specific task by ID
router.delete('/:id', taskController.deleteTask);

module.exports = router;
