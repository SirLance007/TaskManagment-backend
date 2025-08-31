import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Create user
router.post("/", userController.createUser);

// Get all users
router.get("/", userController.getUsers);

// Get single user
router.get("/:id", userController.getUserById);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

export default router;