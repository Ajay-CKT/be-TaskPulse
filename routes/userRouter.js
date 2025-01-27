const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");
const userRouter = express.Router();

userRouter.put(
  "/edit-profile/:id",
  authenticate.checkAuth,
  userController.editProfile
);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.put("/reset-password/:token", userController.resetPassword);
userRouter.post(
  "/create-task",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.createTask
);
userRouter.put(
  "/update-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.updateTask
);
userRouter.delete(
  "/delete-task/:taskId",
  authenticate.checkAuth,
  authenticate.allowedRoles(["user"]),
  userController.deleteTask
);

module.exports = userRouter;
