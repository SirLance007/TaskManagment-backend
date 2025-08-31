// src/services/userService.js
import { User, Task, Comment } from "../models/index.js";
import { Op } from "sequelize";

class UserService {
  async createUser(userData) {
    const existingUser = await User.findOne({ 
      where: { email: userData.email.toLowerCase() } 
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const normalizedData = {
      ...userData,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim()
    };
    
    const user = await User.create(normalizedData);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async getAllUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const { search } = filters;
    
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    return await User.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { 
          model: Task, 
          as: 'assignedTasks',
          attributes: ['task_id', 'title', 'type', 'priority', 'status', 'due_date']
        },
        { 
          model: Task, 
          as: 'CreatedTasks',
          attributes: ['task_id', 'title', 'type', 'priority', 'status', 'due_date']
        }
      ]
    });
    
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    
    const updateFields = {};
    const validationErrors = [];
    
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length === 0) {
        validationErrors.push('Name is required and cannot be empty');
      } else if (updateData.name.length > 255) {
        validationErrors.push('Name cannot exceed 255 characters');
      } else {
        updateFields.name = updateData.name.trim();
      }
    }
    
    if (updateData.email !== undefined) {
      if (!updateData.email || updateData.email.trim().length === 0) {
        validationErrors.push('Email is required and cannot be empty');
      } else if (!this.validateEmail(updateData.email)) {
        validationErrors.push('Invalid email format');
      } else if (updateData.email.length > 255) {
        validationErrors.push('Email cannot exceed 255 characters');
      } else {
        updateFields.email = updateData.email.toLowerCase().trim();
      }
    }
    
    if (updateData.password !== undefined) {
      if (!updateData.password || updateData.password.length === 0) {
        validationErrors.push('Password is required and cannot be empty');
      } else if (!this.validatePassword(updateData.password)) {
        validationErrors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      } else {
        updateFields.password = updateData.password;
      }
    }
    
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    if (updateFields.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: updateFields.email,
          user_id: { [Op.ne]: userId }
        } 
      });
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }
    
    await user.update(updateFields);
    
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    
    // Check dependencies
    const assignedTaskCount = await Task.count({ where: { assignee_id: userId } });
    const createdTaskCount = await Task.count({ where: { created_by: userId } });
    const commentCount = await Comment.count({ where: { user_id: userId } });
    
    if (assignedTaskCount > 0 || createdTaskCount > 0 || commentCount > 0) {
      throw new Error(`Cannot delete user with ${assignedTaskCount} assigned tasks, ${createdTaskCount} created tasks, and ${commentCount} comments`);
    }
    
    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  // ==================== VALIDATION METHODS ====================

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  validateId(id) {
    const numId = parseInt(id);
    return !isNaN(numId) && numId > 0;
  }
}

export default new UserService();