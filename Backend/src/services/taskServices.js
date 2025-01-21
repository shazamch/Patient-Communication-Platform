const TasksModel = require("../models/tasksModel");

// Create a new Task
exports.createTask = async (taskData) => {
  try {
    const newTask = new TasksModel(taskData);
    await newTask.save();
    return { success: true, task: newTask };
  } catch (error) {
    console.error("Error in createTask service:", error);
    return {
      success: false,
      message: "An error occurred while creating the task.",
    };
  }
};

// Get all Tasks
exports.getAllTasks = async () => {
  try {
    const tasks = await TasksModel.find()      

    return { success: true, tasks };
  } catch (error) {
    console.error("Error in getAllTasks service:", error);
    return {
      success: false,
      message: "An error occurred while fetching tasks.",
    };
  }
};

// Get a single Task by ID
exports.getTaskById = async (taskId) => {
  try {
    const task = await TasksModel.findById(taskId)

    if (!task) {
      return { success: false, message: "Task not found." };
    }
    return { success: true, task };
  } catch (error) {
    console.error("Error in getTaskById service:", error);
    return {
      success: false,
      message: "An error occurred while fetching the task.",
    };
  }
};

// Update a Task
exports.updateTask = async (taskId, updateData) => {
  try {
    const updatedTask = await TasksModel.findByIdAndUpdate(
      taskId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedTask) {
      return { success: false, message: "Task not found." };
    }
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error("Error in updateTask service:", error);
    return {
      success: false,
      message: "An error occurred while updating the task.",
    };
  }
};

// Delete a Task
exports.deleteTask = async (taskId) => {
  try {
    const deletedTask = await TasksModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return { success: false, message: "Task not found." };
    }
    return { success: true, message: "Task deleted successfully." };
  } catch (error) {
    console.error("Error in deleteTask service:", error);
    return {
      success: false,
      message: "An error occurred while deleting the task.",
    };
  }
};

// Get Tasks Assigned to a Specific User ID
exports.getTasksByAssignedToID = async (userID) => {
  try {
    const tasks = await TasksModel.find({ assignedToID: userID });

    if (!tasks || tasks.length === 0) {
      return { success: false, message: "No tasks found for this user." };
    }
    return { success: true, tasks };
  } catch (error) {
    console.error("Error in getTasksByAssignedToID service:", error);
    return {
      success: false,
      message: "An error occurred while fetching tasks.",
    };
  }
};
