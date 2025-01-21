const taskService = require("../services/taskServices");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const taskData = req.body;
    const response = await taskService.createTask(taskData);

    if (!response.success) {
      return res.sendResponse(400, false, response.message);
    }

    res.sendResponse(201, true, "Task created successfully", response.task, accessToken);
  } catch (error) {
    console.error("Error in createTask controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { accessToken } = req.user;

    const response = await taskService.getAllTasks();

    if (!response.success) {
      return res.sendResponse(400, false, response.message);
    }

    res.sendResponse(200, true, "Tasks fetched successfully", response.tasks, accessToken);
  } catch (error) {
    console.error("Error in getAllTasks controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const taskId = req.params.id;

    const response = await taskService.getTaskById(taskId);

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(200, true, "Task fetched successfully", response.task, accessToken);
  } catch (error) {
    console.error("Error in getTaskById controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const taskId = req.params.id;
    const updateData = req.body;

    const response = await taskService.updateTask(taskId, updateData);

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(200, true, "Task updated successfully", response.task, accessToken);
  } catch (error) {
    console.error("Error in updateTask controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const taskId = req.params.id;

    const response = await taskService.deleteTask(taskId);

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(200, true, response.message, null, accessToken);
  } catch (error) {
    console.error("Error in deleteTask controller:", error);
    res.sendResponse(500, false, error.message);
  }
};

// Get Tasks by Assigned User ID
exports.getTasksByAssignedToID = async (req, res) => {
  try {
    const { accessToken } = req.user;
    const userID = req.params.userID;

    const response = await taskService.getTasksByAssignedToID(userID);

    if (!response.success) {
      return res.sendResponse(404, false, response.message);
    }

    res.sendResponse(200, true, "Tasks fetched successfully", response.tasks, accessToken);
  } catch (error) {
    console.error("Error in getTasksByAssignedToID controller:", error);
    res.sendResponse(500, false, error.message);
  }
};
