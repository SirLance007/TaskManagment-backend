// controllers/userController.js
import userService from '../services/userService.js';

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const filters = { search };
    const pagination = { 
      page: page ? parseInt(page) : 1, 
      limit: limit ? parseInt(limit) : 10 
    };
    
    const result = await userService.getAllUsers(filters, pagination);
    res.json({
      users: result.rows,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(result.count / pagination.limit),
        totalItems: result.count,
        itemsPerPage: pagination.limit
      }
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(404).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(400).json({ error: err.message });
  }
};

// Default export for all user controller functions
export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};