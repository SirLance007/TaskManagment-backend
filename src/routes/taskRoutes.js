import express from "express";
import taskController from "../controllers/taskController.js";

const router = express.Router();

// ==================== TASK STATUS ROUTES ====================
// These must come BEFORE the /:id routes to avoid conflicts

// Create Status 
router.post("/status/", taskController.createTaskStatus);

// Get all statuses
router.get("/status/", taskController.getTaskStatuses);

// Get single status
router.get("/status/:id", taskController.getTaskStatusById);

// Update status
router.put("/status/:id", taskController.updateTaskStatus);

// Delete status 
router.delete("/status/:id", taskController.deleteTaskStatus);

// ==================== TASK CC MEMBERS ROUTES ====================
// These must come BEFORE the /:id routes to avoid conflicts

// Add CC to a task
router.post("/:taskId/cc", taskController.createTaskCcMember);

// Add CC members in bulk to a task
router.post("/:taskId/cc/bulk", taskController.createTaskCcMembersBulk);

// Get all CC members for a task
router.get("/:taskId/cc", taskController.getTaskCcMembers);

// Remove CC from task
router.delete("/:taskId/cc/:id", taskController.deleteTaskCcMember);

// ==================== TASK COMMENTS ROUTES ====================
// These must come BEFORE the /:id routes to avoid conflicts

// Create comment for a task
router.post("/:taskId/comments", taskController.createTaskComment);

// Get all comments for a task
router.get("/:taskId/comments", taskController.getTaskComments);

// Get single comment
router.get("/:taskId/comments/:commentId", taskController.getTaskCommentById);

// Update comment
router.put("/:taskId/comments/:commentId", taskController.updateTaskComment);

// Delete comment
router.delete("/:taskId/comments/:commentId", taskController.deleteTaskComment);

// ==================== MAIN TASK ROUTES ====================
// These must come AFTER the specific routes to avoid conflicts

// Create Task
router.post("/", taskController.createTask);

// Get all tasks
router.get("/", taskController.getTasks);

// Get single task
router.get("/:id", taskController.getTaskById);

// Update task
router.put("/:id", taskController.updateTask);

// Delete task
router.delete("/:id", taskController.deleteTask);

// Get Task details
router.get("/:taskId/details" , taskController.getTaskDetails);

export default router;