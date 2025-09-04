// controllers/taskController.js
import taskService from '../services/taskService.js';

export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    {console.log("query" , req.query)};
    const { page, limit, status, priority, type } = req.query;
    const filters = { status, priority, type };
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };

    const result = await taskService.getAllTasks(filters, pagination);
    res.json({
      tasks: result.tasks,
      pagination: result.pagination,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params; 
    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const details = await taskService.getTaskDetails(taskId);

    res.json(details); 
  } catch (err) {
    console.error("Error fetching task details:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(404).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskService.updateTask(id, req.body);
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTask(id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(400).json({ error: err.message });
  }
};

// ==================== TASK STATUS CONTROLLERS ====================

export const createTaskStatus = async (req, res) => {
  try {
    const status = await taskService.createTaskStatus(req.body);
    res.status(201).json(status);
  } catch (err) {
    console.error("Error creating task status:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getTaskStatuses = async (req, res) => {
  try {
    const { page, limit, type } = req.query;
    const filters = { type };
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };

    const result = await taskService.getAllTaskStatuses(filters, pagination);
    res.json({
      statuses: result.rows,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(result.count / pagination.limit),
        totalItems: result.count,
        itemsPerPage: pagination.limit
      }
    });
  } catch (err) {
    console.error("Error fetching task statuses:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getTaskStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await taskService.getTaskStatusById(id);
    res.json(status);
  } catch (err) {
    console.error("Error fetching task status:", err);
    res.status(404).json({ error: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await taskService.updateTaskStatus(id, req.body);
    res.json(status);
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await taskService.deleteTaskStatus(id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting task status:", err);
    res.status(400).json({ error: err.message });
  }
};

// ==================== TASK CC MEMBER CONTROLLERS ====================

export const createTaskCcMember = async (req, res) => {
  try {
    const { taskId } = req.params;
    const ccMember = await taskService.createTaskCcMember(taskId, req.body);
    res.status(201).json(ccMember);
  } catch (err) {
    console.error("Error creating task CC member:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getTaskCcMembers = async (req, res) => {
  try {
    const { taskId } = req.params;
    const ccMembers = await taskService.getTaskCcMembers(taskId);
    res.json(ccMembers);
  } catch (err) {
    console.error("Error fetching task CC members:", err);
    res.status(404).json({ error: err.message });
  }
};

export const deleteTaskCcMember = async (req, res) => {
  try {
    const { taskId, id } = req.params;
    const result = await taskService.deleteTaskCcMember(taskId, id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting task CC member:", err);
    res.status(400).json({ error: err.message });
  }
};

export const createTaskCcMembersBulk = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_ids = [] } = req.body;
    const ccMembers = await taskService.createTaskCcMembersBulk(taskId, user_ids);
    res.status(201).json(ccMembers);
  } catch (err) {
    console.error("Error creating task CC members (bulk):", err);
    res.status(400).json({ error: err.message });
  }
};

// ==================== TASK COMMENT CONTROLLERS ====================

export const createTaskComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comment = await taskService.createTaskComment(taskId, req.body);
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating task comment:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page, limit } = req.query;
    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };

    const result = await taskService.getTaskComments(taskId, pagination);
    res.json({
      comments: result.rows,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(result.count / pagination.limit),
        totalItems: result.count,
        itemsPerPage: pagination.limit
      }
    });
  } catch (err) {
    console.error("Error fetching task comments:", err);
    res.status(404).json({ error: err.message });
  }
};

export const getTaskCommentById = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const comment = await taskService.getTaskCommentById(taskId, commentId);
    res.json(comment);
  } catch (err) {
    console.error("Error fetching task comment:", err);
    res.status(404).json({ error: err.message });
  }
};

export const updateTaskComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const comment = await taskService.updateTaskComment(taskId, commentId, req.body);
    res.json(comment);
  } catch (err) {
    console.error("Error updating task comment:", err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteTaskComment = async (req, res) => {
  try {
    const { taskId, commentId } = req.params;
    const result = await taskService.deleteTaskComment(taskId, commentId);
    res.json(result);
  } catch (err) {
    console.error("Error deleting task comment:", err);
    res.status(400).json({ error: err.message });
  }
};

// Default export for all task controller functions
export default {
  // Main task controllers
  createTask,
  getTasks,
  getTaskDetails,
  getTaskById,
  updateTask,
  deleteTask,

  // Task status controllers
  createTaskStatus,
  getTaskStatuses,
  getTaskStatusById,
  updateTaskStatus,
  deleteTaskStatus,

  // Task CC member controllers
  createTaskCcMember,
  getTaskCcMembers,
  deleteTaskCcMember,
  createTaskCcMembersBulk,

  // Task comment controllers
  createTaskComment,
  getTaskComments,
  getTaskCommentById,
  updateTaskComment,
  deleteTaskComment
};