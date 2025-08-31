// src/services/taskService.js
import { Task, User, TaskStatus, Comment, TaskCcMember } from "../models/index.js";
import { Op } from "sequelize";

class TaskService {
  // ==================== MAIN TASK SERVICES ====================

  async createTask(taskData) {
    return await Task.create(taskData);
  }

  async getAllTasks(filters = {}, pagination = {}, userId) {
    const { page = 1, limit = 10 } = pagination;
    const { status, priority, assignee_id, type } = filters;

    const whereClause = {};

    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignee_id) whereClause.assignee_id = assignee_id;
    if (type) whereClause.type = type;
    if (userId) whereClause.created_by = userId;

    const tasks = await Task.findAll({
      where: whereClause,
      offset: (page - 1) * limit,
      limit: limit,
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const totalCount = await Task.count({
      where: whereClause
    });

    const assignedCount = await Task.count({
      where: {
        assignee_id: userId
      }
    });

    return {
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      },
      assignedCount
    };
  }

  async getTaskById(taskId) {
    return await Task.findByPk(taskId, {
      include: [
        { model: User, as: 'assignee', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'Creator', attributes: ['user_id', 'name', 'email'] },
        { model: TaskStatus, attributes: ['status_id', 'type', 'status_name'] },
        {
          model: Comment,
          include: [{ model: User, attributes: ['user_id', 'name', 'email'] }],
          order: [['created_at', 'DESC']]
        },
        {
          model: TaskCcMember,
          include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
        }
      ]
    });
  }

  async updateTask(taskId, updateData) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    await task.update(updateData);

    return await Task.findByPk(taskId, {
      include: [
        { model: User, as: 'assignee', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'Creator', attributes: ['user_id', 'name', 'email'] },
        { model: TaskStatus, attributes: ['status_id', 'type', 'status_name'] }
      ]
    });
  }

  async deleteTask(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    await task.destroy({ cascade: true });
    return { message: 'Task deleted successfully' };
  }

  // ==================== TASK STATUS SERVICES ====================

  async createTaskStatus(statusData) {
    const existingStatus = await TaskStatus.findOne({
      where: { status_name: statusData.status_name }
    });

    if (existingStatus) {
      throw new Error('Status with this name already exists');
    }

    return await TaskStatus.create(statusData);
  }

  async getAllTaskStatuses(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const { type } = filters;

    const whereClause = {};
    if (type) whereClause.type = type;

    const offset = (page - 1) * limit;

    return await TaskStatus.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['status_id', 'ASC']]
    });
  }

  async getTaskStatusById(statusId) {
    const status = await TaskStatus.findByPk(statusId);
    if (!status) throw new Error('Task status not found');
    return status;
  }

  async updateTaskStatus(statusId, updateData) {
    const status = await TaskStatus.findByPk(statusId);
    if (!status) throw new Error('Task status not found');

    if (updateData.status_name) {
      const existingStatus = await TaskStatus.findOne({
        where: {
          status_name: updateData.status_name,
          status_id: { [Op.ne]: statusId }
        }
      });

      if (existingStatus) {
        throw new Error('Status with this name already exists');
      }
    }

    await status.update(updateData);
    return status;
  }

  async deleteTaskStatus(statusId) {
    const status = await TaskStatus.findByPk(statusId);
    if (!status) throw new Error('Task status not found');

    const taskCount = await Task.count({ where: { status: statusId } });
    if (taskCount > 0) {
      throw new Error(`Cannot delete status that is being used by ${taskCount} tasks`);
    }

    await status.destroy();
    return { message: 'Task status deleted successfully' };
  }

  // ==================== TASK CC MEMBER SERVICES ====================

  async createTaskCcMember(taskId, ccData) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    const user = await User.findByPk(ccData.user_id);
    if (!user) throw new Error('User not found');

    const existingCc = await TaskCcMember.findOne({
      where: { task_id: taskId, user_id: ccData.user_id }
    });

    if (existingCc) {
      throw new Error('User is already a CC member for this task');
    }

    const ccMember = await TaskCcMember.create({ ...ccData, task_id: taskId });

    return await TaskCcMember.findByPk(ccMember.id, {
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });
  }

  async getTaskCcMembers(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    return await TaskCcMember.findAll({
      where: { task_id: taskId },
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }],
      order: [['id', 'ASC']]
    });
  }

  async deleteTaskCcMember(taskId, ccMemberId) {
    const ccMember = await TaskCcMember.findByPk(ccMemberId);
    if (!ccMember) throw new Error('CC member not found');

    if (ccMember.task_id != taskId) {
      throw new Error('CC member does not belong to the specified task');
    }

    await ccMember.destroy();
    return { message: 'CC member removed successfully' };
  }

  // ==================== TASK COMMENT SERVICES ====================

  async createTaskComment(taskId, commentData) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    const user = await User.findByPk(commentData.user_id);
    if (!user) throw new Error('User not found');

    const comment = await Comment.create({ ...commentData, task_id: taskId });

    return await Comment.findByPk(comment.comment_id, {
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });
  }

  async getTaskComments(taskId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;

    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');

    const offset = (page - 1) * limit;

    return await Comment.findAndCountAll({
      where: { task_id: taskId },
      limit: limit,
      offset: offset,
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async getTaskCommentById(taskId, commentId) {
    const comment = await Comment.findByPk(commentId, {
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });

    if (!comment) throw new Error('Comment not found');

    if (comment.task_id != taskId) {
      throw new Error('Comment does not belong to the specified task');
    }

    return comment;
  }

  async updateTaskComment(taskId, commentId, updateData) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error('Comment not found');

    if (comment.task_id != taskId) {
      throw new Error('Comment does not belong to the specified task');
    }

    await comment.update(updateData);

    return await Comment.findByPk(commentId, {
      include: [{ model: User, attributes: ['user_id', 'name', 'email'] }]
    });
  }

  async deleteTaskComment(taskId, commentId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) throw new Error('Comment not found');

    if (comment.task_id != taskId) {
      throw new Error('Comment does not belong to the specified task');
    }

    await comment.destroy();
    return { message: 'Comment deleted successfully' };
  }

  // ==================== VALIDATION SERVICES ====================

  async validateUserExists(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async validateTaskStatusExists(statusId) {
    const status = await TaskStatus.findByPk(statusId);
    if (!status) throw new Error('Status not found');
    return status;
  }

  async validateTaskExists(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('Task not found');
    return task;
  }
}

export default new TaskService();